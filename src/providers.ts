/**
 * # UI-Router for Angular (v2+)
 *
 * - [@uirouter/angular home page](https://ui-router.github.io/ng2)
 * - [tutorials](https://ui-router.github.io/tutorial/ng2/helloworld)
 * - [quick start repository](http://github.com/ui-router/quickstart-ng2)
 *
 * Getting started:
 *
 * - Use npm. Add a dependency on latest `@uirouter/angular`
 * - Import UI-Router classes directly from `"@uirouter/angular"`
 *
 * ```js
 * import {StateRegistry} from "@uirouter/angular";
 * ```
 *
 * - Create application states (as defined by [[Ng2StateDeclaration]]).
 *
 * ```js
 * export let state1: Ng2StateDeclaration = {
 *   name: 'state1',
 *   component: State1Component,
 *   url: '/one'
 * }
 *
 * export let state2: Ng2StateDeclaration = {
 *   name: 'state2',
 *   component: State2Component,
 *   url: '/two'
 * }
 * ```
 *
 * - Import a [[UIRouterModule.forChild]] module into your feature `NgModule`s.
 *
 * ```js
 * @ NgModule({
 *   imports: [
 *     SharedModule,
 *     UIRouterModule.forChild({ states: [state1, state2 ] })
 *   ],
 *   declarations: [
 *     State1Component,
 *     State2Component,
 *   ]
 * })
 * export class MyFeatureModule {}
 * ```
 *
 * - Import a [[UIRouterModule.forRoot]] module into your application root `NgModule`
 * - Either bootstrap a [[UIView]] component, or add a `<ui-view></ui-view>` viewport to your root component.
 *
 * ```js
 * @ NgModule({
 *   imports: [
 *     BrowserModule,
 *     UIRouterModule.forRoot({ states: [ homeState ] }),
 *     MyFeatureModule,
 *   ],
 *   declarations: [
 *     HomeComponent
 *   ]
 *   bootstrap: [ UIView ]
 * })
 * class RootAppModule {}
 *
 * browserPlatformDynamic.bootstrapModule(RootAppModule);
 * ```
 *
 * - Optionally specify a configuration class [[ChildModule.configClass]] for any module
 * to perform any router configuration during bootstrap or lazyload.
 * Pass the class to [[UIRouterModule.forRoot]] or [[UIRouterModule.forChild]].
 *
 * ```js
 * import {UIRouter} from "@uirouter/angular";
 *
 * @ Injectable()
 * export class MyUIRouterConfig {
 *   // Constructor is injectable
 *   constructor(uiRouter: UIRouter) {
 *     uiRouter.urlMatcherFactory.type('datetime', myDateTimeParamType);
 *   }
 * }
 * ```
 *
 * @preferred @module ng2
 */
/** */
import { Injector, Provider } from "@angular/core";
import {
  UIRouter, PathNode, StateRegistry, StateService, TransitionService, UrlMatcherFactory, UrlRouter, ViewService,
  UrlService, UIRouterGlobals, services, Resolvable, NATIVE_INJECTOR_TOKEN
} from "@uirouter/core";
import { UIView, ParentUIViewInject } from "./directives/uiView";
import { ng2ViewsBuilder, Ng2ViewConfig } from "./statebuilders/views";
import { Ng2ViewDeclaration } from "./interface";
import { applyRootModuleConfig, applyModuleConfig } from "./uiRouterConfig";
import { RootModule, StatesModule, UIROUTER_ROOT_MODULE, UIROUTER_MODULE_TOKEN } from "./uiRouterNgModule";
import { servicesPlugin, ServicesPlugin } from "@uirouter/core";
import { ng2LazyLoadBuilder } from "./statebuilders/lazyLoad";
import { UIRouterRx } from "@uirouter/rx";
import { LocationStrategy } from "@angular/common";
import { Ng2LocationServices } from "./location/locationService";
import { Ng2LocationConfig } from "./location/locationConfig";

/**
 * This is a factory function for a UIRouter instance
 *
 * Creates a UIRouter instance and configures it for Angular, then invokes router bootstrap.
 * This function is used as an Angular `useFactory` Provider.
 */
export function uiRouterFactory(locationStrategy: LocationStrategy, injector: Injector) {
  let rootModules: RootModule[] = injector.get(UIROUTER_ROOT_MODULE);
  let modules: StatesModule[] = injector.get(UIROUTER_MODULE_TOKEN);

  if (rootModules.length !== 1) {
    throw new Error("Exactly one UIRouterModule.forRoot() should be in the bootstrapped app module's imports: []");
  }

  // ----------------- Create router -----------------
  // Create a new ng2 UIRouter and configure it for ng2
  let router = new UIRouter();

  // Add RxJS plugin
  router.plugin(UIRouterRx);

  // Add $q-like and $injector-like service APIs
  router.plugin<ServicesPlugin>(servicesPlugin);


  // ----------------- Monkey Patches ----------------
  // Monkey patch the services.$injector to use the root ng2 Injector
  services.$injector.get = injector.get.bind(injector);


  // ----------------- Configure for ng2 -------------
  router.locationService = new Ng2LocationServices(router, locationStrategy);
  router.locationConfig = new Ng2LocationConfig(router, locationStrategy);

  // Apply ng2 ui-view handling code
  let viewConfigFactory = (path: PathNode[], config: Ng2ViewDeclaration) => new Ng2ViewConfig(path, config);
  router.viewService._pluginapi._viewConfigFactory("ng2", viewConfigFactory);

  // Apply statebuilder decorator for ng2 NgModule registration
  let registry = router.stateRegistry;
  registry.decorator('views', ng2ViewsBuilder);
  registry.decorator('lazyLoad', ng2LazyLoadBuilder);

  // Prep the tree of NgModule by placing the root NgModule's Injector on the root state.
  let ng2InjectorResolvable = Resolvable.fromData(NATIVE_INJECTOR_TOKEN, injector);
  registry.root().resolvables.push(ng2InjectorResolvable);

  // Auto-flush the parameter type queue
  router.urlMatcherFactory.$get();

  // ----------------- Initialize router -------------
  rootModules.forEach(moduleConfig => applyRootModuleConfig(router, injector, moduleConfig));
  modules.forEach(moduleConfig => applyModuleConfig(router, injector, moduleConfig));

  // Start monitoring the URL
  if (!router.urlRouter.interceptDeferred) {
    router.urlService.listen();
    router.urlService.sync();
  }

  return router;
}

export function parentUIViewInjectFactory(r: StateRegistry) { return { fqn: null, context: r.root() } as ParentUIViewInject; }

export const _UIROUTER_INSTANCE_PROVIDERS: Provider[] =  [
  { provide: UIRouter, useFactory: uiRouterFactory, deps: [LocationStrategy, Injector] },
  { provide: UIView.PARENT_INJECT, useFactory: parentUIViewInjectFactory, deps: [StateRegistry]},
];

export function fnStateService(r: UIRouter) { return r.stateService; }
export function fnTransitionService(r: UIRouter) { return r.transitionService; }
export function fnUrlMatcherFactory(r: UIRouter) { return r.urlMatcherFactory; }
export function fnUrlRouter(r: UIRouter) { return r.urlRouter; }
export function fnUrlService(r: UIRouter) { return r.urlService; }
export function fnViewService(r: UIRouter) { return r.viewService; }
export function fnStateRegistry(r: UIRouter) { return r.stateRegistry; }
export function fnGlobals(r: any) { return r.globals; }

export const _UIROUTER_SERVICE_PROVIDERS: Provider[] = [
  { provide: StateService,      useFactory: fnStateService,       deps: [UIRouter]},
  { provide: TransitionService, useFactory: fnTransitionService,  deps: [UIRouter]},
  { provide: UrlMatcherFactory, useFactory: fnUrlMatcherFactory,  deps: [UIRouter]},
  { provide: UrlRouter,         useFactory: fnUrlRouter,          deps: [UIRouter]},
  { provide: UrlService,        useFactory: fnUrlService,         deps: [UIRouter]},
  { provide: ViewService,       useFactory: fnViewService,        deps: [UIRouter]},
  { provide: StateRegistry,     useFactory: fnStateRegistry,      deps: [UIRouter]},
  { provide: UIRouterGlobals,   useFactory: fnGlobals,            deps: [UIRouter]},
];

/**
 * The UI-Router providers, for use in your application bootstrap
 *
 * @deprecated use [[UIRouterModule.forRoot]]
 */
export const UIROUTER_PROVIDERS: Provider[] = _UIROUTER_INSTANCE_PROVIDERS.concat(_UIROUTER_SERVICE_PROVIDERS);
