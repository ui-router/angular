/** @ng2api @module directives */
/** */
import { UIRouter, extend, Obj, TransitionOptions, TargetState } from "@uirouter/core";
import { Directive, Inject, Input, Optional, ElementRef, Renderer2, OnChanges, SimpleChanges } from "@angular/core";
import { UIView, ParentUIViewInject } from "./uiView";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Subscription } from "rxjs/Subscription";

/**
 * @internalapi
 * # blah blah blah
 */
@Directive({ selector: 'a[uiSref]' })
export class AnchorUISref {
  constructor(public _el: ElementRef, public _renderer: Renderer2) { }
  openInNewTab() {
    return this._el.nativeElement.target === '_blank';
  }
  update(href: string) {
    if (href && href !== '') {
      this._renderer.setProperty(this._el.nativeElement, 'href', href);
    } else {
      this._renderer.removeAttribute(this._el.nativeElement, 'href');
    }
  }
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
@Directive({
  selector: '[uiSref]',
  exportAs: 'uiSref',
  host: { '(click)': 'go()' }
})
export class UISref implements OnChanges {

  /**
   * `@Input('uiSref')` The name of the state to link to
   *
   * ```html
   * <a uiSref="hoome">Home</a>
   * ```
   */
  @Input('uiSref') state: string;

  /**
   * `@Input('uiParams')` The parameter values to use (as key/values)
   *
   * ```html
   * <a uiSref="book" [uiParams]="{ bookId: book.id }">Book {{ book.name }}</a>
   * ```
   */
  @Input('uiParams') params: any;

  /**
   * `@Input('uiOptions')` The transition options
   *
   * ```html
   * <a uiSref="books" [uiOptions]="{ reload: true }">Book {{ book.name }}</a>
   * ```
   */
  @Input('uiOptions') options: TransitionOptions;

  /**
   * An observable (ReplaySubject) of the state this UISref is targeting.
   * When the UISref is clicked, it will transition to this [[TargetState]].
   */
  public targetState$ = new ReplaySubject<TargetState>(1);

  /** @internalapi */ private _emit: boolean = false;
  /** @internalapi */ private _statesSub: Subscription;
  /** @internalapi */ private _router: UIRouter;
  /** @internalapi */ private _anchorUISref: AnchorUISref;
  /** @internalapi */ private _parent: ParentUIViewInject;

  constructor(
      _router: UIRouter,
      @Optional() _anchorUISref: AnchorUISref,
      @Inject(UIView.PARENT_INJECT) parent: ParentUIViewInject,
  ) {
    this._router = _router;
    this._anchorUISref = _anchorUISref;
    this._parent = parent;

    this._statesSub = _router.globals.states$.subscribe(() => this.update());
  }

  /** @internalapi */
  set "uiSref"(val: string) { this.state = val; this.update(); }
  /** @internalapi */
  set "uiParams"(val: Obj) { this.params = val; this.update(); }
  /** @internalapi */
  set "uiOptions"(val: TransitionOptions) { this.options = val; this.update(); }

  ngOnInit() {
    this._emit = true;
    this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  ngOnDestroy() {
    this._emit = false;
    this._statesSub.unsubscribe();
    this.targetState$.unsubscribe();
  }

  private update() {
    let $state = this._router.stateService;
    if (this._emit) {
      let newTarget = $state.target(this.state, this.params, this.getOptions());
      this.targetState$.next(newTarget);
    }

    if (this._anchorUISref) {
      let href = $state.href(this.state, this.params, this.getOptions());
      this._anchorUISref.update(href);
    }
  }

  getOptions() {
    let defaultOpts: TransitionOptions = {
      relative: this._parent && this._parent.context && this._parent.context.name,
      inherit: true ,
      source: "sref"
    };
    return extend(defaultOpts, this.options || {});
  }

  /** When triggered by a (click) event, this function transitions to the UISref's target state */
  go() {
    if (this._anchorUISref && this._anchorUISref.openInNewTab()) {
      return ;
    }

    this._router.stateService.go(this.state, this.params, this.getOptions());
    return false;
  }
}
