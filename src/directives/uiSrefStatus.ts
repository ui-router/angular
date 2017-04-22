/** @ng2api @module directives */
/** */
import { Directive, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { UISref } from './uiSref';
import {
  PathNode, Transition, TargetState, StateObject, anyTrueR, tail, unnestR, Predicate, UIRouterGlobals, Param, PathUtils
} from '@uirouter/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {of} from 'rxjs/observable/of';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {switchMap} from 'rxjs/operator/switchMap';
import {mergeMap} from 'rxjs/operator/mergeMap';
import {map} from 'rxjs/operator/map';
import {concat} from 'rxjs/operator/concat';

/** @internalapi */
interface TransEvt { evt: string; trans: Transition; }

/**
 * UISref status emitted from [[UISrefStatus]]
 */
export interface SrefStatus {
  /** The sref's target state (or one of its children) is currently active */
  active: boolean;
  /** The sref's target state is currently active */
  exact: boolean;
  /** A transition is entering the sref's target state */
  entering: boolean;
  /** A transition is exiting the sref's target state */
  exiting: boolean;
}

/** @internalapi */
const inactiveStatus: SrefStatus = {
  active: false,
  exact: false,
  entering: false,
  exiting: false
};

/**
 * Returns a Predicate<PathNode[]>
 *
 * The predicate returns true when the target state (and param values)
 * match the (tail of) the path, and the path's param values
 *
 * @internalapi
 */
const pathMatches = (target: TargetState): Predicate<PathNode[]> => {
  if (!target.exists()) return () => false;
  let state: StateObject = target.$state();
  let targetParamVals = target.params();
  let targetPath: PathNode[] = PathUtils.buildPath(target);
  let paramSchema: Param[] = targetPath.map(node => node.paramSchema)
      .reduce(unnestR, [])
      .filter((param: Param) => targetParamVals.hasOwnProperty(param.id));

  return (path: PathNode[]) => {
    let tailNode = tail(path);
    if (!tailNode || tailNode.state !== state) return false;
    let paramValues = PathUtils.paramValues(path);
    return Param.equals(paramSchema, paramValues, targetParamVals);
  };
};

/**
 * Given basePath: [a, b], appendPath: [c, d]),
 * Expands the path to [c], [c, d]
 * Then appends each to [a,b,] and returns: [a, b, c], [a, b, c, d]
 *
 * @internalapi
 */
function spreadToSubPaths(basePath: PathNode[], appendPath: PathNode[]): PathNode[][] {
  return appendPath.map(node => basePath.concat(PathUtils.subPath(appendPath, n => n.state === node.state)));
}

/**
 * Given a TransEvt (Transition event: started, success, error)
 * and a UISref Target State, return a SrefStatus object
 * which represents the current status of that Sref:
 * active, activeEq (exact match), entering, exiting
 *
 * @internalapi
 */
function getSrefStatus(event: TransEvt, srefTarget: TargetState): SrefStatus {
  const pathMatchesTarget = pathMatches(srefTarget);
  const tc = event.trans.treeChanges();

  let isStartEvent = event.evt === 'start';
  let isSuccessEvent = event.evt === 'success';
  let activePath: PathNode[] = isSuccessEvent ? tc.to : tc.from;

  const isActive = () =>
      spreadToSubPaths([], activePath)
          .map(pathMatchesTarget)
          .reduce(anyTrueR, false);

  const isExact = () =>
      pathMatchesTarget(activePath);

  const isEntering = () =>
      spreadToSubPaths(tc.retained, tc.entering)
          .map(pathMatchesTarget)
          .reduce(anyTrueR, false);

  const isExiting = () =>
      spreadToSubPaths(tc.retained, tc.exiting)
          .map(pathMatchesTarget)
          .reduce(anyTrueR, false);

  return {
    active: isActive(),
    exact: isExact(),
    entering: isStartEvent ? isEntering() : false,
    exiting: isStartEvent ? isExiting() : false,
  } as SrefStatus;
}

/** @internalapi */
function mergeSrefStatus(left: SrefStatus, right: SrefStatus) {
  return {
    active:   left.active   || right.active,
    exact:    left.exact    || right.exact,
    entering: left.entering || right.entering,
    exiting:  left.exiting  || right.exiting,
  };
}

/**
 * A directive which emits events when a paired [[UISref]] status changes.
 *
 * This directive is primarily used by the [[UISrefActive]] directives to monitor `UISref`(s).
 *
 * This directive shares two attribute selectors with `UISrefActive`:
 *
 * - `[uiSrefActive]`
 * - `[uiSrefActiveEq]`.
 *
 * Thus, whenever a `UISrefActive` directive is created, a `UISrefStatus` directive is also created.
 *
 * Most apps should simply use `UISrefActive`, but some advanced components may want to process the
 * [[SrefStatus]] events directly.
 *
 * ```js
 * <li (uiSrefStatus)="onSrefStatusChanged($event)">
 *   <a uiSref="book" [uiParams]="{ bookId: book.id }">Book {{ book.name }}</a>
 * </li>
 * ```
 *
 * The `uiSrefStatus` event is emitted whenever an enclosed `uiSref`'s status changes.
 * The event emitted is of type [[SrefStatus]], and has boolean values for `active`, `exact`, `entering`, and `exiting`.
 *
 * The values from this event can be captured and stored on a component (then applied, e.g., using ngClass).
 *
 * ---
 *
 * A single `uiSrefStatus` can enclose multiple `uiSref`.
 * Each status boolean (`active`, `exact`, `entering`, `exiting`) will be true if *any of the enclosed `uiSref` status is true*.
 * In other words, all enclosed `uiSref` statuses  are merged to a single status using `||` (logical or).
 *
 * ```js
 * <li (uiSrefStatus)="onSrefStatus($event)" uiSref="admin">
 *   Home
 *   <ul>
 *     <li> <a uiSref="admin.users">Users</a> </li>
 *     <li> <a uiSref="admin.groups">Groups</a> </li>
 *   </ul>
 * </li>
 * ```
 *
 * In the above example, `$event.active === true` when either `admin.users` or `admin.groups` is active.
 *
 * ---
 *
 * This API is subject to change.
 */
@Directive({ selector: '[uiSrefStatus],[uiSrefActive],[uiSrefActiveEq]' })
export class UISrefStatus {
  /** current statuses of the state/params the uiSref directive is linking to */
  @Output("uiSrefStatus") uiSrefStatus = new EventEmitter<SrefStatus>(false);
  /** Monitor all child components for UISref(s) */
  @ContentChildren(UISref, {descendants: true}) srefs: QueryList<UISref>;

  /** The current status */
  status: SrefStatus;

  /** @internalapi */ private _subscription: Subscription;
  /** @internalapi */ private _srefChangesSub: Subscription;
  /** @internalapi */ private _srefs$: BehaviorSubject<UISref[]>;
  /** @internalapi */ private _globals: UIRouterGlobals;
  constructor(_globals: UIRouterGlobals) {
    this._globals = _globals;
    this.status = Object.assign({}, inactiveStatus);
  }

  ngAfterContentInit() {
    // Map each transition start event to a stream of:
    // start -> (success|error)
    let transEvents$: Observable<TransEvt> = switchMap.call(this._globals.start$, (trans: Transition) => {
      const event = (evt: string) => ({evt, trans} as TransEvt);

      let transStart$ = of(event("start"));
      let transResult = trans.promise.then(() => event("success"), () => event("error"));
      let transFinish$ = fromPromise(transResult);

      return concat.call(transStart$, transFinish$);
    });

    // Watch the @ContentChildren UISref[] components and get their target states

    // let srefs$: Observable<UISref[]> = of(this.srefs.toArray()).concat(this.srefs.changes);
    this._srefs$ = new BehaviorSubject(this.srefs.toArray());
    this._srefChangesSub = this.srefs.changes.subscribe(srefs => this._srefs$.next(srefs));

    let targetStates$: Observable<TargetState[]> =
        switchMap.call(this._srefs$, (srefs: UISref[]) =>
            combineLatest<TargetState[]>(srefs.map(sref => sref.targetState$)));

    // Calculate the status of each UISref based on the transition event.
    // Reduce the statuses (if multiple) by or-ing each flag.
    this._subscription = mergeMap.call(transEvents$, (evt: TransEvt) => {
      return map.call(targetStates$, (targets: TargetState[]) => {
        let statuses: SrefStatus[] = targets.map(target => getSrefStatus(evt, target));
        return statuses.reduce(mergeSrefStatus);
      });
    }).subscribe(this._setStatus.bind(this));
  }

  ngOnDestroy() {
    if (this._subscription) this._subscription.unsubscribe();
    if (this._srefChangesSub) this._srefChangesSub.unsubscribe();
    if (this._srefs$) this._srefs$.unsubscribe();
    this._subscription = this._srefChangesSub = this._srefs$ = undefined;
  }

  private _setStatus(status: SrefStatus) {
    this.status = status;
    this.uiSrefStatus.emit(status);
  }
}
