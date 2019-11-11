/** @ng2api @module directives */
/** */
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
  ReflectiveInjector,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import {
  ActiveUIView,
  filter,
  inArray,
  isFunction,
  NATIVE_INJECTOR_TOKEN,
  Param,
  parse,
  PathNode,
  ResolveContext,
  StateDeclaration,
  trace,
  Transition,
  TransitionHookFn,
  UIRouter,
  unnestR,
  ViewConfig,
  ViewContext,
} from '@uirouter/core';
import { Ng2ViewConfig } from '../statebuilders/views';
import { MergeInjector } from '../mergeInjector';
import { Ng2Component } from '../interface';

/** @hidden */
let id = 0;

/** @internalapi These are provide()d as the string UIView.PARENT_INJECT */
export interface ParentUIViewInject {
  context: ViewContext;
  fqn: string;
}

/** @internalapi */
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
 * @internalapi
 */
const ng2ComponentInputs = (factory: ComponentFactory<any>): InputMapping[] => {
  return factory.inputs.map(input => ({ prop: input.propName, token: input.templateName }));
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
    <ng-content *ngIf="!_componentRef"></ng-content>
  `,
})
export class UIView implements OnInit, OnDestroy {
  static PARENT_INJECT = 'UIView.PARENT_INJECT';

  @ViewChild('componentTarget', { read: ViewContainerRef, static: true })
  _componentTarget: ViewContainerRef;
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
  private _uiViewData: ActiveUIView = <any>{};
  private _parent: ParentUIViewInject;

  constructor(
    public router: UIRouter,
    @Inject(UIView.PARENT_INJECT) parent,
    public viewContainerRef: ViewContainerRef
  ) {
    this._parent = parent;
  }

  /**
   * @returns the UI-Router `state` that is filling this uiView, or `undefined`.
   */
  public get state(): StateDeclaration {
    return parse('_uiViewData.config.viewDecl.$context.self')(this);
  }

  ngOnInit() {
    const router = this.router;
    const parentFqn = this._parent.fqn;
    const name = this.name || '$default';

    this._uiViewData = {
      $type: 'ng2',
      id: id++,
      name: name,
      fqn: parentFqn ? parentFqn + '.' + name : name,
      creationContext: this._parent.context,
      configUpdated: this._viewConfigUpdated.bind(this),
      config: undefined,
    };

    this._deregisterUiCanExitHook = router.transitionService.onBefore({}, trans => {
      return this._invokeUiCanExitHook(trans);
    });

    this._deregisterUiOnParamsChangedHook = router.transitionService.onSuccess({}, trans =>
      this._invokeUiOnParamsChangedHook(trans)
    );

    this._deregisterUIView = router.viewService.registerUIView(this._uiViewData);
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
        trans.onStart({}, function() {
          return uiCanExitFn.call(instance, trans);
        });
      }
    }
  }

  /**
   * For each transition, checks if any param values changed and notify component
   */
  private _invokeUiOnParamsChangedHook($transition$: Transition) {
    const instance: Ng2Component = this._componentRef && this._componentRef.instance;
    const uiOnParamsChanged: TransitionHookFn = instance && instance.uiOnParamsChanged;

    if (isFunction(uiOnParamsChanged)) {
      const viewState: StateDeclaration = this.state;
      const resolveContext: ResolveContext = new ResolveContext(this._uiViewData.config.path);
      const viewCreationTrans = resolveContext.getResolvable('$transition$').data;

      // Exit early if the $transition$ is the same as the view was created within.
      // Exit early if the $transition$ will exit the state the view is for.
      if ($transition$ === viewCreationTrans || $transition$.exiting().indexOf(viewState as StateDeclaration) !== -1)
        return;

      const toParams: { [paramName: string]: any } = $transition$.params('to');
      const fromParams: { [paramName: string]: any } = $transition$.params('from');
      const getNodeSchema = (node: PathNode) => node.paramSchema;
      const toSchema: Param[] = $transition$
        .treeChanges('to')
        .map(getNodeSchema)
        .reduce(unnestR, []);
      const fromSchema: Param[] = $transition$
        .treeChanges('from')
        .map(getNodeSchema)
        .reduce(unnestR, []);

      // Find the to params that have different values than the from params
      const changedToParams = toSchema.filter((param: Param) => {
        const idx = fromSchema.indexOf(param);
        return idx === -1 || !fromSchema[idx].type.equals(toParams[param.id], fromParams[param.id]);
      });

      // Only trigger callback if a to param has changed or is new
      if (changedToParams.length) {
        const changedKeys: string[] = changedToParams.map(x => x.id);
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
    if (this._deregisterUIView) this._deregisterUIView();
    if (this._deregisterUiCanExitHook) this._deregisterUiCanExitHook();
    if (this._deregisterUiOnParamsChangedHook) this._deregisterUiOnParamsChangedHook();
    this._deregisterUIView = this._deregisterUiCanExitHook = this._deregisterUiOnParamsChangedHook = null;
    this._disposeLast();
  }

  /**
   * The view service is informing us of an updated ViewConfig
   * (usually because a transition activated some state and its views)
   */
  _viewConfigUpdated(config: ViewConfig) {
    // The config may be undefined if there is nothing currently targeting this UIView.
    // Dispose the current component, if there is one
    if (!config) return this._disposeLast();

    // Only care about Ng2 configs
    if (!(config instanceof Ng2ViewConfig)) return;

    // The "new" viewconfig is already applied, so exit early
    if (this._uiViewData.config === config) return;

    // This is a new ViewConfig.  Dispose the previous component
    this._disposeLast();
    trace.traceUIViewConfigUpdated(this._uiViewData, config && config.viewDecl.$context);

    this._applyUpdatedConfig(config);

    // Initiate change detection for the newly created component
    this._componentRef.changeDetectorRef.markForCheck();
  }

  private _applyUpdatedConfig(config: Ng2ViewConfig) {
    this._uiViewData.config = config;
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
      .map(token => context.getResolvable(token))
      .filter(r => r.resolved);

    const newProviders = resolvables.map(r => ({ provide: r.token, useValue: context.injector().get(r.token) }));

    const parentInject = { context: this._uiViewData.config.viewDecl.$context, fqn: this._uiViewData.fqn };
    newProviders.push({ provide: UIView.PARENT_INJECT, useValue: parentInject });

    const parentComponentInjector = this.viewContainerRef.injector;
    const moduleInjector = context.getResolvable(NATIVE_INJECTOR_TOKEN).data;
    const mergedParentInjector = new MergeInjector(moduleInjector, parentComponentInjector);

    return ReflectiveInjector.resolveAndCreate(newProviders, mergedParentInjector);
  }

  /**
   * Supplies component inputs with resolve data
   *
   * Finds component inputs which match resolves (by name) and sets the input value
   * to the resolve data.
   */
  private _applyInputBindings(factory: ComponentFactory<any>, component: any, context: ResolveContext, componentClass) {
    const bindings = this._uiViewData.config.viewDecl['bindings'] || {};
    const explicitBoundProps = Object.keys(bindings);

    // Returns the actual component property for a renamed an input renamed using `@Input('foo') _foo`.
    // return the `_foo` property
    const renamedInputProp = (prop: string) => {
      const input = factory.inputs.find(i => i.templateName === prop);
      return (input && input.propName) || prop;
    };

    // Supply resolve data to component as specified in the state's `bindings: {}`
    const explicitInputTuples = explicitBoundProps.reduce(
      (acc, key) => acc.concat([{ prop: renamedInputProp(key), token: bindings[key] }]),
      []
    );

    // Supply resolve data to matching @Input('prop') or inputs: ['prop']
    const implicitInputTuples = ng2ComponentInputs(factory).filter(tuple => !inArray(explicitBoundProps, tuple.prop));

    const addResolvable = (tuple: InputMapping) => ({
      prop: tuple.prop,
      resolvable: context.getResolvable(tuple.token),
    });

    const injector = context.injector();

    explicitInputTuples
      .concat(implicitInputTuples)
      .map(addResolvable)
      .filter(tuple => tuple.resolvable && tuple.resolvable.resolved)
      .forEach(tuple => {
        component[tuple.prop] = injector.get(tuple.resolvable.token);
      });
  }
}
