var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/** @ng2api @module directives */
/** */
import { Directive, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { UISref } from './uiSref';
import { anyTrueR, tail, unnestR, UIRouterGlobals, Param, PathUtils } from '@uirouter/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { switchMap } from 'rxjs/operator/switchMap';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { map } from 'rxjs/operator/map';
import { concat } from 'rxjs/operator/concat';
/** @internalapi */
var inactiveStatus = {
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
var pathMatches = function (target) {
    if (!target.exists())
        return function () { return false; };
    var state = target.$state();
    var targetParamVals = target.params();
    var targetPath = PathUtils.buildPath(target);
    var paramSchema = targetPath.map(function (node) { return node.paramSchema; })
        .reduce(unnestR, [])
        .filter(function (param) { return targetParamVals.hasOwnProperty(param.id); });
    return function (path) {
        var tailNode = tail(path);
        if (!tailNode || tailNode.state !== state)
            return false;
        var paramValues = PathUtils.paramValues(path);
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
function spreadToSubPaths(basePath, appendPath) {
    return appendPath.map(function (node) { return basePath.concat(PathUtils.subPath(appendPath, function (n) { return n.state === node.state; })); });
}
/**
 * Given a TransEvt (Transition event: started, success, error)
 * and a UISref Target State, return a SrefStatus object
 * which represents the current status of that Sref:
 * active, activeEq (exact match), entering, exiting
 *
 * @internalapi
 */
function getSrefStatus(event, srefTarget) {
    var pathMatchesTarget = pathMatches(srefTarget);
    var tc = event.trans.treeChanges();
    var isStartEvent = event.evt === 'start';
    var isSuccessEvent = event.evt === 'success';
    var activePath = isSuccessEvent ? tc.to : tc.from;
    var isActive = function () {
        return spreadToSubPaths([], activePath)
            .map(pathMatchesTarget)
            .reduce(anyTrueR, false);
    };
    var isExact = function () {
        return pathMatchesTarget(activePath);
    };
    var isEntering = function () {
        return spreadToSubPaths(tc.retained, tc.entering)
            .map(pathMatchesTarget)
            .reduce(anyTrueR, false);
    };
    var isExiting = function () {
        return spreadToSubPaths(tc.retained, tc.exiting)
            .map(pathMatchesTarget)
            .reduce(anyTrueR, false);
    };
    return {
        active: isActive(),
        exact: isExact(),
        entering: isStartEvent ? isEntering() : false,
        exiting: isStartEvent ? isExiting() : false,
    };
}
/** @internalapi */
function mergeSrefStatus(left, right) {
    return {
        active: left.active || right.active,
        exact: left.exact || right.exact,
        entering: left.entering || right.entering,
        exiting: left.exiting || right.exiting,
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
var UISrefStatus = (function () {
    function UISrefStatus(_globals) {
        /** current statuses of the state/params the uiSref directive is linking to */
        this.uiSrefStatus = new EventEmitter(false);
        this._globals = _globals;
        this.status = Object.assign({}, inactiveStatus);
    }
    UISrefStatus.prototype.ngAfterContentInit = function () {
        var _this = this;
        // Map each transition start event to a stream of:
        // start -> (success|error)
        var transEvents$ = switchMap.call(this._globals.start$, function (trans) {
            var event = function (evt) { return ({ evt: evt, trans: trans }); };
            var transStart$ = of(event("start"));
            var transResult = trans.promise.then(function () { return event("success"); }, function () { return event("error"); });
            var transFinish$ = fromPromise(transResult);
            return concat.call(transStart$, transFinish$);
        });
        // Watch the @ContentChildren UISref[] components and get their target states
        // let srefs$: Observable<UISref[]> = of(this.srefs.toArray()).concat(this.srefs.changes);
        this._srefs$ = new BehaviorSubject(this.srefs.toArray());
        this._srefChangesSub = this.srefs.changes.subscribe(function (srefs) { return _this._srefs$.next(srefs); });
        var targetStates$ = switchMap.call(this._srefs$, function (srefs) {
            return combineLatest(srefs.map(function (sref) { return sref.targetState$; }));
        });
        // Calculate the status of each UISref based on the transition event.
        // Reduce the statuses (if multiple) by or-ing each flag.
        this._subscription = mergeMap.call(transEvents$, function (evt) {
            return map.call(targetStates$, function (targets) {
                var statuses = targets.map(function (target) { return getSrefStatus(evt, target); });
                return statuses.reduce(mergeSrefStatus);
            });
        }).subscribe(this._setStatus.bind(this));
    };
    UISrefStatus.prototype.ngOnDestroy = function () {
        if (this._subscription)
            this._subscription.unsubscribe();
        if (this._srefChangesSub)
            this._srefChangesSub.unsubscribe();
        if (this._srefs$)
            this._srefs$.unsubscribe();
        this._subscription = this._srefChangesSub = this._srefs$ = undefined;
    };
    UISrefStatus.prototype._setStatus = function (status) {
        this.status = status;
        this.uiSrefStatus.emit(status);
    };
    return UISrefStatus;
}());
__decorate([
    Output("uiSrefStatus"),
    __metadata("design:type", Object)
], UISrefStatus.prototype, "uiSrefStatus", void 0);
__decorate([
    ContentChildren(UISref, { descendants: true }),
    __metadata("design:type", QueryList)
], UISrefStatus.prototype, "srefs", void 0);
UISrefStatus = __decorate([
    Directive({ selector: '[uiSrefStatus],[uiSrefActive],[uiSrefActiveEq]' }),
    __metadata("design:paramtypes", [UIRouterGlobals])
], UISrefStatus);
export { UISrefStatus };
//# sourceMappingURL=uiSrefStatus.js.map