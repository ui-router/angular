import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import {
  filter,
  inArray,
  isFunction,
  NATIVE_INJECTOR_TOKEN,
  Param,
  PathNode,
  ResolveContext,
  StateDeclaration,
  trace,
  Transition,
  TransitionHookFn,
  UIRouter,
  unnestR,
} from '@uirouter/core';
import { UIViewPortalRenderCommand } from '@uirouter/core/lib/view/interface';
import { Ng2ViewConfig } from '../statebuilders/views';
import { MergeInjector } from '../mergeInjector';

/** @internal */
interface InputMapping {
  token: string;
  prop: string;
}

/**
 * Given a component class, gets the inputs of styles:
 *
 * - @Input('foo') _foo
 * - `inputs: ['foo']`
 *
 * @internal
 */
const ng2ComponentInputs = (factory: ComponentFactory<any>): InputMapping[] => {
  return factory.inputs.map((input) => ({ prop: input.propName, token: input.templateName }));
};

/**
 * A UI-Router viewport directive, which is filled in by a view (component) on a state.
 *
 * ### Selector
 *
 * A `ui-view` directive can be created as an element: `<ui-view></ui-view>` or as an attribute: `<div ui-view></div>`.
 *
 * ### Purpose
 *
 * This directive is used in a Component template (or as the root component) to create a viewport.  The viewport
 * is filled in by a view (as defined by a [[Ng2ViewDeclaration]] inside a [[Ng2StateDeclaration]]) when the view's
 * state has been activated.
 *
 * #### Example:
 * ```js
 * // This app has two states, 'foo' and 'bar'
 * stateRegistry.register({ name: 'foo', url: '/foo', component: FooComponent });
 * stateRegistry.register({ name: 'bar', url: '/bar', component: BarComponent });
 * ```
 * ```html
 * <!-- This ui-view will be filled in by the foo state's component or
 *      the bar state's component when the foo or bar state is activated -->
 * <ui-view></ui-view>
 * ```
 *
 * ### Named ui-views
 *
 * A `ui-view` may optionally be given a name via the attribute value: `<div ui-view='header'></div>`.  *Note:
 * an unnamed `ui-view` is internally named `$default`*.   When a `ui-view` has a name, it will be filled in
 * by a matching named view.
 *
 * #### Example:
 * ```js
 * stateRegistry.register({
 *   name: 'foo',
 *   url: '/foo',
 *   views: { header: HeaderComponent, $default: FooComponent });
 * ```
 * ```html
 * <!-- When 'foo' state is active, filled by HeaderComponent -->
 * <div ui-view="header"></div>
 *
 * <!-- When 'foo' state is active, filled by FooComponent -->
 * <ui-view></ui-view>
 * ```
 */
@Component({
  selector: 'ui-view, [ui-view]',
  exportAs: 'uiView',
  template: `
    <ng-template #componentTarget></ng-template>
    <ng-content *ngIf="!_componentRef && !_renderInterop"></ng-content>
    <div #interopDiv *ngIf="_renderInterop"></div>
  `,
})
export class UIView implements OnInit, OnDestroy {
  /** This injection token is used to inject the parent UIView ID */
  static PARENT_UIVIEW_ID_TOKEN = 'UIView.PARENT_INJECT';

  @ViewChild('componentTarget', { read: ViewContainerRef, static: true })
  _componentTarget: ViewContainerRef;

  @ViewChild('interopDiv', { read: ViewContainerRef })
  set interopDiv(ref: ViewContainerRef) {
    if (this._renderCommand.command === 'RENDER_INTEROP_DIV') {
      this._renderCommand.giveDiv(ref.element.nativeElement);
    }
  }

  @Input('name') name: string;

  @Input('ui-view')
  set _name(val: string) {
    this.name = val;
  }

  /** The reference to the component currently inside the viewport */
  _componentRef: ComponentRef<any>;
  /** Deregisters the ui-view from the view service */
  private _deregisterUIView: Function;
  /** Deregisters the master uiCanExit transition hook */
  private _deregisterUiCanExitHook: Function;
  /** Deregisters the master uiOnParamsChanged transition hook */
  private _deregisterUiOnParamsChangedHook: Function;

  /** Data about the this UIView */
  private _id: string;
  private _parentUIViewId: string;
  protected _renderCommand: UIViewPortalRenderCommand;
  /** @internal */
  _renderInterop = false;

  constructor(
    public router: UIRouter,
    @Inject(UIView.PARENT_UIVIEW_ID_TOKEN) parentUIViewId: string,
    public viewContainerRef: ViewContainerRef
  ) {
    this._parentUIViewId = parentUIViewId;
  }

  private _getViewConfig(): Ng2ViewConfig {
    if (this._renderCommand?.command === 'RENDER_ROUTED_VIEW') {
      return this._renderCommand.routedViewConfig as Ng2ViewConfig;
    }
  }

  /**
   * @returns the UI-Router `state` that is filling this uiView, or `undefined`.
   */
  public get state(): StateDeclaration {
    return this._renderCommand.command === 'RENDER_ROUTED_VIEW' ? this._renderCommand.contentState : undefined;
  }

  ngOnInit() {
    const router = this.router;
    const name = this.name || '$default';

    this._deregisterUiCanExitHook = router.transitionService.onBefore({}, (trans) => {
      return this._invokeUiCanExitHook(trans);
    });

    this._deregisterUiOnParamsChangedHook = router.transitionService.onSuccess({}, (trans) =>
      this._invokeUiOnParamsChangedHook(trans)
    );

    const renderContentIntoUIViewPortal = this._renderContentIntoUIViewPortal.bind(this);
    router.viewService.registerView('ng2', this._parentUIViewId, name, renderContentIntoUIViewPortal);
  }

  /**
   * For each transition, checks the component loaded in the ui-view for:
   *
   * - has a uiCanExit() component hook
   * - is being exited
   *
   * If both are true, adds the uiCanExit component function as a hook to that singular Transition.
   */
  private _invokeUiCanExitHook(trans: Transition) {
    const instance = this._componentRef && this._componentRef.instance;
    const uiCanExitFn: TransitionHookFn = instance && instance.uiCanExit;

    if (isFunction(uiCanExitFn)) {
      const state: StateDeclaration = this.state;

      if (trans.exiting().indexOf(state) !== -1) {
        trans.onStart({}, function () {
          return uiCanExitFn.call(instance, trans);
        });
      }
    }
  }

  /**
   * For each transition, checks if any param values changed and notify component
   */
  private _invokeUiOnParamsChangedHook($transition$: Transition) {
    const instance = this._componentRef && this._componentRef.instance;
    const uiOnParamsChanged: TransitionHookFn = instance && instance.uiOnParamsChanged;

    if (isFunction(uiOnParamsChanged)) {
      const resolveContext: ResolveContext = new ResolveContext(this._getViewConfig()?.path ?? []);
      const viewCreationTrans = resolveContext.getResolvable('$transition$').data;

      // Exit early if the $transition$ is the same as the view was created within.
      // Exit early if the $transition$ will exit the state the view is for.
      if ($transition$ === viewCreationTrans || $transition$.exiting().indexOf(this.state) !== -1) {
        return;
      }

      const toParams: { [paramName: string]: any } = $transition$.params('to');
      const fromParams: { [paramName: string]: any } = $transition$.params('from');
      const getNodeSchema = (node: PathNode) => node.paramSchema;
      const toSchema: Param[] = $transition$.treeChanges('to').map(getNodeSchema).reduce(unnestR, []);
      const fromSchema: Param[] = $transition$.treeChanges('from').map(getNodeSchema).reduce(unnestR, []);

      // Find the to params that have different values than the from params
      const changedToParams = toSchema.filter((param: Param) => {
        const idx = fromSchema.indexOf(param);
        return idx === -1 || !fromSchema[idx].type.equals(toParams[param.id], fromParams[param.id]);
      });

      // Only trigger callback if a to param has changed or is new
      if (changedToParams.length) {
        const changedKeys: string[] = changedToParams.map((x) => x.id);
        // Filter the params to only changed/new to params.  `$transition$.params()` may be used to get all params.
        const newValues = filter(toParams, (val, key) => changedKeys.indexOf(key) !== -1);
        instance.uiOnParamsChanged(newValues, $transition$);
      }
    }
  }

  private _disposeLast() {
    if (this._componentRef) this._componentRef.destroy();
    this._componentRef = null;
  }

  ngOnDestroy() {
    if (this._id) this.router.viewService.deregisterView(this._id);
    if (this._deregisterUiCanExitHook) this._deregisterUiCanExitHook();
    if (this._deregisterUiOnParamsChangedHook) this._deregisterUiOnParamsChangedHook();
    this._deregisterUIView = this._deregisterUiCanExitHook = this._deregisterUiOnParamsChangedHook = null;
    this._disposeLast();
  }

  private _saveUiViewId(uiViewId: string) {
    if (typeof this._id === 'string' && this._id !== uiViewId) {
      throw new Error(
        `Received a render command for wrong UIView. Render command id: ${uiViewId}, UIView id: ${this._id}`
      );
    }

    this._id = uiViewId;
  }

  /**
   * The view service is informing us to change what we are rendering in the portal
   * (usually because a transition activated some state and its views)
   */
  _renderContentIntoUIViewPortal(renderCommand: UIViewPortalRenderCommand): void {
    this._renderCommand = renderCommand;
    this._saveUiViewId(renderCommand.uiViewId);

    // Dispose the previous component
    this._disposeLast();

    // UIView template will handle RENDER_INTEROP_DIV and RENDER_DEFAULT_CONTENT
    this._renderInterop = renderCommand.command === 'RENDER_INTEROP_DIV';

    if (renderCommand.command === 'RENDER_ROUTED_VIEW') {
      const registeredportal = this.router.viewService._pluginapi._registeredUIView(this._id);
      trace.traceUIViewConfigUpdated(registeredportal, this.state.$$state()); // TODO: move to core
      this._renderRoutedConfigComponent(renderCommand.routedViewConfig);
    }

    // Initiate change detection for the newly created component
    this._componentRef?.changeDetectorRef.markForCheck();
  }

  private _renderRoutedConfigComponent(config: Ng2ViewConfig) {
    // Create the Injector for the routed component
    const context = new ResolveContext(config.path);
    const componentInjector = this._getComponentInjector(context);

    // Get the component class from the view declaration. TODO: allow promises?
    const componentClass = config.viewDecl.component;

    // Create the component
    const compFactoryResolver = componentInjector.get(ComponentFactoryResolver);
    const compFactory = compFactoryResolver.resolveComponentFactory(componentClass);
    this._componentRef = this._componentTarget.createComponent(compFactory, undefined, componentInjector);

    // Wire resolves to @Input()s
    this._applyInputBindings(compFactory, this._componentRef.instance, context, componentClass);
  }

  /**
   * Creates a new Injector for a routed component.
   *
   * Adds resolve values to the Injector
   * Adds providers from the NgModule for the state
   * Adds providers from the parent Component in the component tree
   * Adds a PARENT_INJECT view context object
   *
   * @returns an Injector
   */
  private _getComponentInjector(context: ResolveContext): Injector {
    // Map resolves to "useValue: providers"
    const resolvables = context
      .getTokens()
      .map((token) => context.getResolvable(token))
      .filter((r) => r.resolved);

    const newProviders = resolvables.map((r) => ({ provide: r.token, useValue: context.injector().get(r.token) }));
    newProviders.push({ provide: UIView.PARENT_UIVIEW_ID_TOKEN, useValue: this._id });

    const parentComponentInjector = this.viewContainerRef.injector;
    const moduleInjector = context.getResolvable(NATIVE_INJECTOR_TOKEN).data;
    const mergedParentInjector = new MergeInjector(moduleInjector, parentComponentInjector);

    return Injector.create({ providers: newProviders, parent: mergedParentInjector });
  }

  /**
   * Supplies component inputs with resolve data
   *
   * Finds component inputs which match resolves (by name) and sets the input value
   * to the resolve data.
   */
  private _applyInputBindings(factory: ComponentFactory<any>, component: any, context: ResolveContext, componentClass) {
    const bindings = this._getViewConfig()?.viewDecl?.bindings ?? {};
    const explicitBoundProps = Object.keys(bindings);

    // Returns the actual component property for a renamed an input renamed using `@Input('foo') _foo`.
    // return the `_foo` property
    const renamedInputProp = (prop: string) => {
      const input = factory.inputs.find((i) => i.templateName === prop);
      return (input && input.propName) || prop;
    };

    // Supply resolve data to component as specified in the state's `bindings: {}`
    const explicitInputTuples = explicitBoundProps.reduce(
      (acc, key) => acc.concat([{ prop: renamedInputProp(key), token: bindings[key] }]),
      []
    );

    // Supply resolve data to matching @Input('prop') or inputs: ['prop']
    const implicitInputTuples = ng2ComponentInputs(factory).filter((tuple) => !inArray(explicitBoundProps, tuple.prop));

    const addResolvable = (tuple: InputMapping) => ({
      prop: tuple.prop,
      resolvable: context.getResolvable(tuple.token),
    });

    const injector = context.injector();

    explicitInputTuples
      .concat(implicitInputTuples)
      .map(addResolvable)
      .filter((tuple) => tuple.resolvable && tuple.resolvable.resolved)
      .forEach((tuple) => {
        component[tuple.prop] = injector.get(tuple.resolvable.token);
      });
  }
}
