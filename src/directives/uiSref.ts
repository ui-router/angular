import {
  RawParams,
  UIRouter,
  extend,
  Obj,
  StateOrName,
  TransitionOptions,
  TargetState,
  isNumber,
  isNullOrUndefined,
} from '@uirouter/core';
import {
  Directive,
  Inject,
  Input,
  Optional,
  ElementRef,
  Renderer2,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { UIView, ParentUIViewInject } from './uiView';
import { ReplaySubject, Subscription } from 'rxjs';

/**
 * @internal
 * # blah blah blah
 */
@Directive({
  selector: 'a[uiSref]',
  standalone: true,
})
export class AnchorUISref {
  constructor(
    public _el: ElementRef,
    public _renderer: Renderer2
  ) {}

  openInNewTab() {
    return this._el.nativeElement.target === '_blank';
  }

  update(href?: string | null) {
    if (!isNullOrUndefined(href)) {
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
  standalone: true,
})
export class UISref implements OnInit, OnDestroy {
  /**
   * `@Input('uiSref')` The name of the state to link to
   *
   * ```html
   * <a uiSref="hoome">Home</a>
   * ```
   */
  @Input('uiSref') state?: StateOrName | null;

  /**
   * `@Input('uiParams')` The parameter values to use (as key/values)
   *
   * ```html
   * <a uiSref="book" [uiParams]="{ bookId: book.id }">Book {{ book.name }}</a>
   * ```
   */
  @Input('uiParams') params?: RawParams | null;

  /**
   * `@Input('uiOptions')` The transition options
   *
   * ```html
   * <a uiSref="books" [uiOptions]="{ reload: true }">Book {{ book.name }}</a>
   * ```
   */
  @Input('uiOptions') options?: TransitionOptions | null;

  /**
   * An observable (ReplaySubject) of the state this UISref is targeting.
   * When the UISref is clicked, it will transition to this [[TargetState]].
   */
  public targetState$ = new ReplaySubject<TargetState>(1);

  /** @internal */ private _emit = false;
  /** @internal */ private _statesSub: Subscription;
  /** @internal */ private _router: UIRouter;
  /** @internal */ private _anchorUISref?: AnchorUISref;
  /** @internal */ private _parent: ParentUIViewInject;

  constructor(
    _router: UIRouter,
    @Optional() _anchorUISref: AnchorUISref,
    @Inject(UIView.PARENT_INJECT) parent: ParentUIViewInject
  ) {
    this._router = _router;
    this._anchorUISref = _anchorUISref ?? undefined;
    this._parent = parent;

    this._statesSub = _router.globals.states$?.subscribe(() => this.update()) ?? new Subscription();
  }

  ngOnInit() {
    this._emit = true;
    this.update();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.update();
  }

  ngOnDestroy() {
    this._emit = false;
    this._statesSub.unsubscribe();
    this.targetState$.unsubscribe();
  }

  private update() {
    const $state = this._router.stateService;
    if (this._emit) {
      const newTarget = $state.target((this.state ?? null) as StateOrName, this.params ?? undefined, this.getOptions());
      this.targetState$.next(newTarget);
    }

    if (this._anchorUISref) {
      if (!this.state) {
        this._anchorUISref.update(null);
      } else {
        const href = $state.href(this.state, this.params ?? undefined, this.getOptions()) || '';
        this._anchorUISref.update(href);
      }
    }
  }

  getOptions() {
    const defaultOpts: TransitionOptions = {
      relative: this._parent && this._parent.context && this._parent.context.name,
      inherit: true,
      source: 'sref',
    };
    return extend(defaultOpts, this.options || {});
  }

  /** When triggered by a (click) event, this function transitions to the UISref's target state */
  @HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey'])
  go(button: number, ctrlKey: boolean, metaKey: boolean) {
    if (
      (this._anchorUISref &&
        (this._anchorUISref.openInNewTab() || button || !isNumber(button) || ctrlKey || metaKey)) ||
      !this.state
    ) {
      return;
    }

    this._router.stateService.go(this.state, this.params ?? undefined, this.getOptions());
    return false;
  }
}
