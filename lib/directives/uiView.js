/** @ng2api @module directives */
/** */
import { Component, ComponentFactoryResolver, ViewContainerRef, Input, ReflectiveInjector, ViewChild, Inject } from '@angular/core';
import { ɵReflectorReader as ReflectorReader } from '@angular/core';
import { UIRouter, isFunction, parse, inArray, trace, ResolveContext, NATIVE_INJECTOR_TOKEN, flattenR } from 'ui-router-core';
import { Ng2ViewConfig } from '../statebuilders/views';
import { MergeInjector } from '../mergeInjector';
/** @hidden */
var id = 0;
/**
 * Given a component class, gets the inputs of styles:
 *
 * - @Input('foo') _foo
 * - `inputs: ['foo']`
 *
 * @internalapi
 */
var ng2ComponentInputs = function (reflector, ng2CompClass, component) {
    /** Get "@Input('foo') _foo" inputs */
    var props = reflector.propMetadata(ng2CompClass);
    var _props = Object.keys(props || {})
        .map(function (key) { return ({ key: key, annoArr: props[key] }); })
        .reduce(function (acc, tuple) { return acc.concat(tuple.annoArr.map(function (anno) { return ({ key: tuple.key, anno: anno }); })); }, [])
        .filter(function (tuple) { return tuple.anno instanceof Input; })
        .map(function (tuple) { return ({ token: tuple.anno.bindingPropertyName || tuple.key, prop: tuple.key }); });
    /** Get "inputs: ['foo']" inputs */
    var inputs = reflector.annotations(ng2CompClass)
        .filter(function (x) { return x instanceof Component && !!x.inputs; })
        .map(function (x) { return x.inputs; })
        .reduce(flattenR, [])
        .map(function (input) { return ({ token: input, prop: input }); });
    /** Get @ResolveData('foo') _foo" inputs */
    var __inputs = component.__inputs || {};
    var resolves = Object.keys(__inputs)
        .map(function (key) { return ({ token: key, prop: __inputs[key] }); });
    return _props.concat(inputs).concat(resolves);
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
var UIView = (function () {
    function UIView(router, parent, viewContainerRef, reflector) {
        this.router = router;
        this.viewContainerRef = viewContainerRef;
        this.reflector = reflector;
        /** Data about the this UIView */
        this.uiViewData = {};
        this.parent = parent;
    }
    Object.defineProperty(UIView.prototype, "_name", {
        set: function (val) { this.name = val; },
        enumerable: true,
        configurable: true
    });
    UIView.prototype.ngOnInit = function () {
        var _this = this;
        var router = this.router;
        var parentFqn = this.parent.fqn;
        var name = this.name || '$default';
        this.uiViewData = {
            $type: 'ng2',
            id: id++,
            name: name,
            fqn: parentFqn ? parentFqn + "." + name : name,
            creationContext: this.parent.context,
            configUpdated: this.viewConfigUpdated.bind(this),
            config: undefined
        };
        this.deregisterHook = router.transitionService.onBefore({}, function (trans) { return _this.applyUiCanExitHook(trans); });
        this.deregisterUIView = router.viewService.registerUIView(this.uiViewData);
    };
    /**
     * For each transition, checks the component loaded in the ui-view for:
     *
     * - has a uiCanExit() component hook
     * - is being exited
     *
     * If both are true, adds the uiCanExit component function as a hook to that singular Transition.
     */
    UIView.prototype.applyUiCanExitHook = function (trans) {
        var instance = this.componentRef && this.componentRef.instance;
        var uiCanExitFn = instance && instance.uiCanExit;
        if (isFunction(uiCanExitFn)) {
            var state = parse("uiViewData.config.viewDecl.$context.self")(this);
            if (trans.exiting().indexOf(state) !== -1) {
                trans.onStart({}, function (trans) {
                    return uiCanExitFn.call(instance, trans);
                });
            }
        }
    };
    UIView.prototype.disposeLast = function () {
        if (this.componentRef)
            this.componentRef.destroy();
        this.componentRef = null;
    };
    UIView.prototype.ngOnDestroy = function () {
        if (this.deregisterUIView)
            this.deregisterUIView();
        if (this.deregisterHook)
            this.deregisterHook();
        this.disposeLast();
    };
    /**
     * The view service is informing us of an updated ViewConfig
     * (usually because a transition activated some state and its views)
     */
    UIView.prototype.viewConfigUpdated = function (config) {
        // The config may be undefined if there is nothing currently targeting this UIView.
        // Dispose the current component, if there is one
        if (!config)
            return this.disposeLast();
        // Only care about Ng2 configs
        if (!(config instanceof Ng2ViewConfig))
            return;
        // The "new" viewconfig is already applied, so exit early
        if (this.uiViewData.config === config)
            return;
        // This is a new ViewConfig.  Dispose the previous component
        this.disposeLast();
        trace.traceUIViewConfigUpdated(this.uiViewData, config && config.viewDecl.$context);
        this.applyUpdatedConfig(config);
    };
    UIView.prototype.applyUpdatedConfig = function (config) {
        this.uiViewData.config = config;
        // Create the Injector for the routed component
        var context = new ResolveContext(config.path);
        var componentInjector = this.getComponentInjector(context);
        // Get the component class from the view declaration. TODO: allow promises?
        var componentClass = config.viewDecl.component;
        // Create the component
        var compFactoryResolver = componentInjector.get(ComponentFactoryResolver);
        var compFactory = compFactoryResolver.resolveComponentFactory(componentClass);
        this.componentRef = this.componentTarget.createComponent(compFactory, undefined, componentInjector);
        // Wire resolves to @Input()s
        this.applyInputBindings(this.componentRef, context, componentClass);
    };
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
    UIView.prototype.getComponentInjector = function (context) {
        // Map resolves to "useValue: providers"
        var resolvables = context.getTokens().map(function (token) { return context.getResolvable(token); }).filter(function (r) { return r.resolved; });
        var newProviders = resolvables.map(function (r) { return ({ provide: r.token, useValue: r.data }); });
        var parentInject = { context: this.uiViewData.config.viewDecl.$context, fqn: this.uiViewData.fqn };
        newProviders.push({ provide: UIView.PARENT_INJECT, useValue: parentInject });
        var parentComponentInjector = this.viewContainerRef.injector;
        var moduleInjector = context.getResolvable(NATIVE_INJECTOR_TOKEN).data;
        var mergedParentInjector = new MergeInjector(moduleInjector, parentComponentInjector);
        return ReflectiveInjector.resolveAndCreate(newProviders, mergedParentInjector);
    };
    /**
     * Supplies component inputs with resolve data
     *
     * Finds component inputs which match resolves (by name) and sets the input value
     * to the resolve data.
     */
    UIView.prototype.applyInputBindings = function (ref, context, componentClass) {
        var component = ref.instance;
        var bindings = this.uiViewData.config.viewDecl['bindings'] || {};
        var explicitBoundProps = Object.keys(bindings);
        // Supply resolve data to matching @Input('prop') or inputs: ['prop']
        var explicitInputTuples = explicitBoundProps
            .reduce(function (acc, key) { return acc.concat([{ prop: key, token: bindings[key] }]); }, []);
        var implicitInputTuples = ng2ComponentInputs(this.reflector, componentClass, component)
            .filter(function (tuple) { return !inArray(explicitBoundProps, tuple.prop); });
        var addResolvable = function (tuple) { return ({
            prop: tuple.prop,
            resolvable: context.getResolvable(tuple.token),
        }); };
        explicitInputTuples.concat(implicitInputTuples)
            .map(addResolvable)
            .filter(function (tuple) { return tuple.resolvable && tuple.resolvable.resolved; })
            .forEach(function (tuple) { component[tuple.prop] = tuple.resolvable.data; });
        // Initiate change detection for the newly created component
        ref.changeDetectorRef.detectChanges();
    };
    return UIView;
}());
export { UIView };
UIView.PARENT_INJECT = "UIView.PARENT_INJECT";
UIView.decorators = [
    { type: Component, args: [{
                selector: 'ui-view, [ui-view]',
                template: "\n    <template #componentTarget></template>\n    <ng-content *ngIf=\"!componentRef\"></ng-content>\n  "
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
            },] },
];
/** @nocollapse */
UIView.ctorParameters = function () { return [
    { type: UIRouter, },
    { type: undefined, decorators: [{ type: Inject, args: [UIView.PARENT_INJECT,] },] },
    { type: ViewContainerRef, },
    { type: ReflectorReader, },
]; };
UIView.propDecorators = {
    'componentTarget': [{ type: ViewChild, args: ['componentTarget', { read: ViewContainerRef },] },],
    'name': [{ type: Input, args: ['name',] },],
    '_name': [{ type: Input, args: ['ui-view',] },],
};
//# sourceMappingURL=uiView.js.map