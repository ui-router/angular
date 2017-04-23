var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/** @ng2api @module directives */
/** */
import { Component, ComponentFactoryResolver, ViewContainerRef, Input, ReflectiveInjector, ViewChild, Inject } from '@angular/core';
import { reflector } from '../private_import_core';
import { UIRouter, isFunction, parse, inArray, trace, ResolveContext, NATIVE_INJECTOR_TOKEN, flattenR } from '@uirouter/core';
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
var ng2ComponentInputs = function (ng2CompClass, component) {
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
    return _props.concat(inputs);
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
var UIView = UIView_1 = (function () {
    function UIView(router, parent, viewContainerRef) {
        this.router = router;
        this.viewContainerRef = viewContainerRef;
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
        newProviders.push({ provide: UIView_1.PARENT_INJECT, useValue: parentInject });
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
        var implicitInputTuples = ng2ComponentInputs(componentClass, component)
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
UIView.PARENT_INJECT = "UIView.PARENT_INJECT";
__decorate([
    ViewChild('componentTarget', { read: ViewContainerRef }),
    __metadata("design:type", ViewContainerRef)
], UIView.prototype, "componentTarget", void 0);
__decorate([
    Input('name'),
    __metadata("design:type", String)
], UIView.prototype, "name", void 0);
__decorate([
    Input('ui-view'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], UIView.prototype, "_name", null);
UIView = UIView_1 = __decorate([
    Component({
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
    }),
    __param(1, Inject(UIView_1.PARENT_INJECT)),
    __metadata("design:paramtypes", [UIRouter, Object, ViewContainerRef])
], UIView);
export { UIView };
var UIView_1;
//# sourceMappingURL=uiView.js.map