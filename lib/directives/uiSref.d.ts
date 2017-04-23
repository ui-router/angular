/** @ng2api @module directives */
/** */
import { UIRouter, Obj, TransitionOptions, TargetState } from "@uirouter/core";
import { ElementRef, Renderer } from "@angular/core";
import { ParentUIViewInject } from "./uiView";
import { ReplaySubject } from "rxjs/ReplaySubject";
/**
 * @internalapi
 * # blah blah blah
 */
export declare class AnchorUISref {
    _el: ElementRef;
    _renderer: Renderer;
    constructor(_el: ElementRef, _renderer: Renderer);
    update(href: string): void;
}
/**
 * A directive when clicked, initiates a [[Transition]] to a [[TargetState]].
 *
 * ### Purpose
 *
 * This directive is applied to anchor tags (`<a>`) or any other clickable element.  It is a state reference (or sref --
 * similar to an href).  When clicked, the directive will transition to that state by calling [[StateService.go]],
 * and optionally supply state parameter values and transition options.
 *
 * When this directive is on an anchor tag, it will also add an `href` attribute to the anchor.
 *
 * ### Selector
 *
 * - `[uiSref]`: The directive is created as an attribute on an element, e.g., `<a uiSref></a>`
 *
 * ### Inputs
 *
 * - `uiSref`: the target state's name, e.g., `uiSref="foostate"`.  If a component template uses a relative `uiSref`,
 * e.g., `uiSref=".child"`, the reference is relative to that component's state.
 *
 * - `uiParams`: any target state parameter values, as an object, e.g., `[uiParams]="{ fooId: bar.fooId }"`
 *
 * - `uiOptions`: [[TransitionOptions]], e.g., `[uiOptions]="{ inherit: false }"`
 *
 * @example
 * ```html
 *
 * <!-- Targets bar state' -->
 * <a uiSref="bar">Bar</a>
 *
 * <!-- Assume this component's state is "foo".
 *      Relatively targets "foo.child" -->
 * <a uiSref=".child">Foo Child</a>
 *
 * <!-- Targets "bar" state and supplies parameter value -->
 * <a uiSref="bar" [uiParams]="{ barId: foo.barId }">Bar {{foo.barId}}</a>
 *
 * <!-- Targets "bar" state and parameter, doesn't inherit existing parameters-->
 * <a uiSref="bar" [uiParams]="{ barId: foo.barId }" [uiOptions]="{ inherit: false }">Bar {{foo.barId}}</a>
 * ```
 */
export declare class UISref {
    /**
     * `@Input('uiSref')` The name of the state to link to
     *
     * ```html
     * <a uiSref="hoome">Home</a>
     * ```
     */
    state: string;
    /**
     * `@Input('uiParams')` The parameter values to use (as key/values)
     *
     * ```html
     * <a uiSref="book" [uiParams]="{ bookId: book.id }">Book {{ book.name }}</a>
     * ```
     */
    params: any;
    /**
     * `@Input('uiOptions')` The transition options
     *
     * ```html
     * <a uiSref="books" [uiOptions]="{ reload: true }">Book {{ book.name }}</a>
     * ```
     */
    options: TransitionOptions;
    /**
     * An observable (ReplaySubject) of the state this UISref is targeting.
     * When the UISref is clicked, it will transition to this [[TargetState]].
     */
    targetState$: ReplaySubject<TargetState>;
    /** @internalapi */ private _emit;
    /** @internalapi */ private _statesSub;
    /** @internalapi */ private _router;
    /** @internalapi */ private _anchorUISref;
    /** @internalapi */ parent: ParentUIViewInject;
    constructor(_router: UIRouter, _anchorUISref: AnchorUISref, parent: ParentUIViewInject);
    /** @internalapi */
    "uiSref": string;
    /** @internalapi */
    "uiParams": Obj;
    /** @internalapi */
    "uiOptions": TransitionOptions;
    ngOnInit(): void;
    ngOnDestroy(): void;
    update(): void;
    getOptions(): TransitionOptions;
    /** When triggered by a (click) event, this function transitions to the UISref's target state */
    go(): boolean;
}
