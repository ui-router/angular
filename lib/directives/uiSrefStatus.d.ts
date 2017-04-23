/** @ng2api @module directives */
/** */
import { EventEmitter, QueryList } from '@angular/core';
import { UISref } from './uiSref';
import { UIRouterGlobals } from '@uirouter/core';
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
export declare class UISrefStatus {
    /** current statuses of the state/params the uiSref directive is linking to */
    uiSrefStatus: EventEmitter<SrefStatus>;
    /** Monitor all child components for UISref(s) */
    srefs: QueryList<UISref>;
    /** The current status */
    status: SrefStatus;
    /** @internalapi */ private _subscription;
    /** @internalapi */ private _srefChangesSub;
    /** @internalapi */ private _srefs$;
    /** @internalapi */ private _globals;
    constructor(_globals: UIRouterGlobals);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    private _setStatus(status);
}
