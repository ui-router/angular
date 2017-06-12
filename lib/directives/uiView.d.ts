/** @ng2api @module directives */
/** */
import { ViewContainerRef, ComponentRef, Injector, ComponentFactory } from '@angular/core';
import { UIRouter, Transition, ViewContext, ViewConfig, ActiveUIView, ResolveContext } from '@uirouter/core';
import { Ng2ViewConfig } from '../statebuilders/views';
/** @internalapi These are provide()d as the string UIView.PARENT_INJECT */
export interface ParentUIViewInject {
    context: ViewContext;
    fqn: string;
}
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
export declare class UIView {
    router: UIRouter;
    viewContainerRef: ViewContainerRef;
    componentTarget: ViewContainerRef;
    name: string;
    _name: string;
    /** The reference to the component currently inside the viewport */
    componentRef: ComponentRef<any>;
    /** Deregisters the ui-view from the view service */
    deregisterUIView: Function;
    /** Deregisters the master uiCanExit transition hook */
    deregisterHook: Function;
    /** Data about the this UIView */
    uiViewData: ActiveUIView;
    parent: ParentUIViewInject;
    static PARENT_INJECT: string;
    constructor(router: UIRouter, parent: any, viewContainerRef: ViewContainerRef);
    ngOnInit(): void;
    /**
     * For each transition, checks the component loaded in the ui-view for:
     *
     * - has a uiCanExit() component hook
     * - is being exited
     *
     * If both are true, adds the uiCanExit component function as a hook to that singular Transition.
     */
    applyUiCanExitHook(trans: Transition): void;
    disposeLast(): void;
    ngOnDestroy(): void;
    /**
     * The view service is informing us of an updated ViewConfig
     * (usually because a transition activated some state and its views)
     */
    viewConfigUpdated(config: ViewConfig): void;
    applyUpdatedConfig(config: Ng2ViewConfig): void;
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
    getComponentInjector(context: ResolveContext): Injector;
    /**
     * Supplies component inputs with resolve data
     *
     * Finds component inputs which match resolves (by name) and sets the input value
     * to the resolve data.
     */
    applyInputBindings(factory: ComponentFactory<any>, ref: ComponentRef<any>, context: ResolveContext, componentClass: any): void;
}
