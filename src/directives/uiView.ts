/** @ng2api @module directives */
/** */
import {
  Component, ComponentFactoryResolver, ViewContainerRef, Input, ComponentRef, Type, ReflectiveInjector, ViewChild,
  Injector, Inject, ComponentFactory
} from '@angular/core';

import {
  UIRouter, isFunction, Transition, parse, TransitionHookFn, StateDeclaration, inArray, trace, ViewContext, ViewConfig,
  ActiveUIView, ResolveContext, NATIVE_INJECTOR_TOKEN, flattenR
} from '@uirouter/core';
import { Ng2ViewConfig } from '../statebuilders/views';
import { MergeInjector } from '../mergeInjector';

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
  template: `
    <ng-template #componentTarget></ng-template>
    <ng-content *ngIf="!componentRef"></ng-content>
  `
  // styles: [`
  //   .done-true {
  //     text-decoration: line-through;
  //     color: grey;
  //   }`
  // ],
  // template: `
  // <div style="padding: 1em; border: 1px solid lightgrey;">
  //
  //   <div #content style="color: lightgrey; font-size: smaller;">
  //     <div>ui-view #{{uiViewData?.id}} created by '{{ parentContext?.name || "(root)" }}' state</div>
  //     <div>name: (absolute) '{{uiViewData?.fqn}}' (contextual) '{{uiViewData?.name}}@{{parentContext?.name}}' </div>
  //     <div>currently filled by: '{{(uiViewData?.config && uiViewData?.config?.viewDecl?.$context) || 'empty...'}}'</div>
  //   </div>
  //
  // </div>`
})
export class UIView {
  @ViewChild('componentTarget', {read: ViewContainerRef}) componentTarget: ViewContainerRef;
  @Input('name') name: string;
  @Input('ui-view') set _name(val: string) { this.name = val; }
  /** The reference to the component currently inside the viewport */
  componentRef: ComponentRef<any>;
  /** Deregisters the ui-view from the view service */
  deregisterUIView: Function;
  /** Deregisters the master uiCanExit transition hook */
  deregisterHook: Function;
  /** Data about the this UIView */
  uiViewData: ActiveUIView = <any> {};
  parent: ParentUIViewInject;

  static PARENT_INJECT = "UIView.PARENT_INJECT";

  constructor(
      public router: UIRouter,
      @Inject(UIView.PARENT_INJECT) parent,
      public viewContainerRef: ViewContainerRef,
  ) {
    this.parent = parent;
  }

  ngOnInit() {
    const router = this.router;
    const parentFqn = this.parent.fqn;
    const name = this.name || '$default';

    this.uiViewData = {
      $type: 'ng2',
      id: id++,
      name: name,
      fqn: parentFqn ? parentFqn + "." + name : name,
      creationContext: this.parent.context,
      configUpdated: this.viewConfigUpdated.bind(this),
      config: undefined
    };

    this.deregisterHook = router.transitionService.onBefore({}, trans => this.applyUiCanExitHook(trans));
    this.deregisterUIView = router.viewService.registerUIView(this.uiViewData);
  }

  /**
   * For each transition, checks the component loaded in the ui-view for:
   *
   * - has a uiCanExit() component hook
   * - is being exited
   *
   * If both are true, adds the uiCanExit component function as a hook to that singular Transition.
   */
  applyUiCanExitHook(trans: Transition) {
    const instance = this.componentRef && this.componentRef.instance;
    const uiCanExitFn: TransitionHookFn = instance && instance.uiCanExit;

    if (isFunction(uiCanExitFn)) {
      const state: StateDeclaration = parse("uiViewData.config.viewDecl.$context.self")(this);

      if (trans.exiting().indexOf(state) !== -1) {
        trans.onStart({}, function() {
          return uiCanExitFn.call(instance, trans);
        });
      }
    }
  }

  disposeLast() {
    if (this.componentRef) this.componentRef.destroy();
    this.componentRef = null;
  }

  ngOnDestroy() {
    if (this.deregisterUIView) this.deregisterUIView();
    if (this.deregisterHook) this.deregisterHook();
    this.disposeLast();
  }

  /**
   * The view service is informing us of an updated ViewConfig
   * (usually because a transition activated some state and its views)
   */
  viewConfigUpdated(config: ViewConfig) {
    // The config may be undefined if there is nothing currently targeting this UIView.
    // Dispose the current component, if there is one
    if (!config) return this.disposeLast();

    // Only care about Ng2 configs
    if (!(config instanceof Ng2ViewConfig)) return;

    // The "new" viewconfig is already applied, so exit early
    if (this.uiViewData.config === config) return;

    // This is a new ViewConfig.  Dispose the previous component
    this.disposeLast();
    trace.traceUIViewConfigUpdated(this.uiViewData, config && config.viewDecl.$context);

    this.applyUpdatedConfig(config);
  }

  applyUpdatedConfig(config: Ng2ViewConfig) {
    this.uiViewData.config = config;
    // Create the Injector for the routed component
    let context = new ResolveContext(config.path);
    let componentInjector = this.getComponentInjector(context);

    // Get the component class from the view declaration. TODO: allow promises?
    let componentClass = config.viewDecl.component;

    // Create the component
    let compFactoryResolver = componentInjector.get(ComponentFactoryResolver);
    let compFactory = compFactoryResolver.resolveComponentFactory(componentClass);
    this.componentRef = this.componentTarget.createComponent(compFactory, undefined, componentInjector);

    // Wire resolves to @Input()s
    this.applyInputBindings(compFactory, this.componentRef, context, componentClass);
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
  getComponentInjector(context: ResolveContext): Injector {
    // Map resolves to "useValue: providers"
    let resolvables = context.getTokens().map(token => context.getResolvable(token)).filter(r => r.resolved);
    let newProviders = resolvables.map(r => ({ provide: r.token, useValue: r.data }));

    let parentInject = { context: this.uiViewData.config.viewDecl.$context, fqn: this.uiViewData.fqn };
    newProviders.push({ provide: UIView.PARENT_INJECT, useValue: parentInject });

    let parentComponentInjector = this.viewContainerRef.injector;
    let moduleInjector = context.getResolvable(NATIVE_INJECTOR_TOKEN).data;
    let mergedParentInjector = new MergeInjector(moduleInjector, parentComponentInjector);

    return ReflectiveInjector.resolveAndCreate(newProviders, mergedParentInjector);
  }

  /**
   * Supplies component inputs with resolve data
   *
   * Finds component inputs which match resolves (by name) and sets the input value
   * to the resolve data.
   */
  applyInputBindings(factory: ComponentFactory<any>, ref: ComponentRef<any>, context: ResolveContext, componentClass) {
    const component = ref.instance;
    const bindings = this.uiViewData.config.viewDecl['bindings'] || {};
    const explicitBoundProps = Object.keys(bindings);

    // Returns the actual component property for a renamed an input renamed using `@Input('foo') _foo`.
    // return the `_foo` property
    const renamedInputProp = (prop: string) => {
      const input = factory.inputs.find(i => i.templateName === prop);
      return input && input.propName || prop;
    };

    // Supply resolve data to component as specified in the state's `bindings: {}`
    const explicitInputTuples = explicitBoundProps
        .reduce((acc, key) => acc.concat([{ prop: renamedInputProp(key), token: bindings[key] }]), []);

    // Supply resolve data to matching @Input('prop') or inputs: ['prop']
    const implicitInputTuples = ng2ComponentInputs(factory)
        .filter(tuple => !inArray(explicitBoundProps, tuple.prop));

    const addResolvable = (tuple: InputMapping) => ({
      prop: tuple.prop,
      resolvable: context.getResolvable(tuple.token),
    });

    explicitInputTuples.concat(implicitInputTuples)
        .map(addResolvable)
        .filter(tuple => tuple.resolvable && tuple.resolvable.resolved)
        .forEach(tuple => { component[tuple.prop] = tuple.resolvable.data; });

    // Initiate change detection for the newly created component
    ref.changeDetectorRef.detectChanges();
  }
}
