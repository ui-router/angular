/** @ng2api @module core */
/** */
import { Ng2StateDeclaration } from "./interface";
import {
  NgModule, OpaqueToken, ModuleWithProviders, ANALYZE_FOR_ENTRY_COMPONENTS, Provider, Injector
} from "@angular/core";
import { CommonModule, LocationStrategy, HashLocationStrategy, PathLocationStrategy } from "@angular/common";
import { _UIROUTER_DIRECTIVES } from "./directives/directives";
import { UIView } from "./directives/uiView";
import { UrlRuleHandlerFn, TargetState, TargetStateDef, UIRouter } from "ui-router-core";
import { _UIROUTER_INSTANCE_PROVIDERS, _UIROUTER_SERVICE_PROVIDERS } from "./providers";

import { ROUTES } from "@angular/router/src/router_config_loader";
/** @hidden */ export const UIROUTER_ROOT_MODULE  = new OpaqueToken("UIRouter Root Module");
/** @hidden */ export const UIROUTER_MODULE_TOKEN = new OpaqueToken("UIRouter Module");
/** @hidden */ export const UIROUTER_STATES       = new OpaqueToken("UIRouter States");
// /** @hidden */ export const ROUTES = UIROUTER_STATES;

export function makeRootProviders(module: StatesModule): Provider[] {
    return [
        { provide: UIROUTER_ROOT_MODULE,         useValue: module,              multi: true},
        { provide: UIROUTER_MODULE_TOKEN,        useValue: module,              multi: true },
        { provide: ROUTES,                       useValue: module.states || [], multi: true },
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: module.states || [], multi: true },
    ];
}

export function makeChildProviders(module: StatesModule): Provider[] {
    return [
        { provide: UIROUTER_MODULE_TOKEN,        useValue: module,              multi: true },
        { provide: ROUTES,                       useValue: module.states || [], multi: true },
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: module.states || [], multi: true },
    ];
}

export function locationStrategy(useHash) {
    return { provide: LocationStrategy, useClass: useHash ? HashLocationStrategy : PathLocationStrategy };
}

/**
 * Creates UI-Router Modules
 *
 * This class has two static factory methods which create UIRouter Modules.
 * A UI-Router Module is an [Angular NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html)
 * with support for UI-Router.
 *
 * ### UIRouter Directives
 *
 * When a UI-Router Module is imported into a `NgModule`, that module's components
 * can use the UIRouter Directives such as [[UIView]], [[UISref]], [[UISrefActive]].
 *
 * ### State Definitions
 *
 * State definitions found in the `states:` property are provided to the Dependency Injector.
 * This enables UI-Router to automatically register the states with the [[StateRegistry]] at bootstrap (and during lazy load).
 *
 * ### Entry Components
 *
 * Any routed components are added as `entryComponents:` so they will get compiled.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [_UIROUTER_DIRECTIVES],
  exports: [_UIROUTER_DIRECTIVES],
  entryComponents: [UIView],
})
export class UIRouterModule {
  /**
   * Creates a UI-Router Module for the root (bootstrapped) application module to import
   *
   * This factory function creates an [Angular NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html)
   * with UI-Router support.
   *
   * The `forRoot` module should be added to the `imports:` of the `NgModule` being bootstrapped.
   * An application should only create and import a single `NgModule` using `forRoot()`.
   * All other modules should be created using [[UIRouterModule.forChild]].
   *
   * Unlike `forChild`, an `NgModule` returned by this factory provides the [[UIRouter]] singleton object.
   * This factory also accepts root-level router configuration.
   * These are the only differences between `forRoot` and `forChild`.
   *
   * Example:
   * ```js
   * let routerConfig = {
   *   otherwise: '/home',
   *   states: [homeState, aboutState]
   * };
   *
   * @ NgModule({
   *   imports: [
   *     BrowserModule,
   *     UIRouterModule.forRoot(routerConfig),
   *     FeatureModule1
   *   ]
   * })
   * class MyRootAppModule {}
   *
   * browserPlatformDynamic.bootstrapModule(MyRootAppModule);
   * ```
   *
   * @param config declarative UI-Router configuration
   * @returns an `NgModule` which provides the [[UIRouter]] singleton instance
   */
  static forRoot(config: RootModule = {}): ModuleWithProviders {
    return {
      ngModule: UIRouterModule,
      providers: [
        _UIROUTER_INSTANCE_PROVIDERS,
        _UIROUTER_SERVICE_PROVIDERS,
        locationStrategy(config.useHash),
        ...makeRootProviders(config),
      ]
    };
  }

  /**
   * Creates an `NgModule` for a UIRouter module
   *
   * This function creates an [Angular NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html)
   * with UI-Router support.
   *
   * #### Example:
   * ```js
   * var homeState = { name: 'home', url: '/home', component: Home };
   * var aboutState = { name: 'about', url: '/about', component: About };
   *
   * @ NgModule({
   *   imports: [
   *     UIRouterModule.forChild({ states: [ homeState, aboutState ] }),
   *     SharedModule,
   *   ],
   *   declarations: [ Home, About ],
   * })
   * export class AppModule {};
   * ```
   *
   * @param module UI-Router module options
   * @returns an `NgModule`
   */
  static forChild(module: StatesModule = {}): ModuleWithProviders {
    return {
      ngModule: UIRouterModule,
      providers: makeChildProviders(module),
    };
  }

}

/**
 * UI-Router declarative configuration which can be provided to [[UIRouterModule.forRoot]]
 */
export interface RootModule extends StatesModule {
  /**
   * Chooses a `LocationStrategy`.
   *
   * The location strategy enables either HTML5 Push State
   * (Requires server-side support) or "HashBang" URLs.
   *
   * When `false`, uses [`PathLocationStrategy`](https://angular.io/docs/ts/latest/api/common/index/PathLocationStrategy-class.html)
   * When `true`, uses [`HashLocationStrategy`](https://angular.io/docs/ts/latest/api/common/index/HashLocationStrategy-class.html)
   *
   * Defaults to `false`
   */
  useHash?: boolean;

  /**
   * Sets [[UrlRouterProvider.otherwise]].
   */
  otherwise?: (string | UrlRuleHandlerFn | TargetState | TargetStateDef);

  /**
   * Sets [[UrlRouterProvider.deferIntercept]]
   */
  deferIntercept?: boolean;
}

/**
 * UI-Router Module declarative configuration which can be passed to [[UIRouterModule.forChild]]
 */
export interface StatesModule {
  /**
   * The module's UI-Router states
   *
   * This list of [[Ng2StateDeclaration]] objects will be registered with the [[StateRegistry]].
   * Also, the components that the states route to will be added to `entryComponents` so they will be compiled.
   */
  states?: Ng2StateDeclaration[];

  /**
   * A UI-Router Module's imperative configuration
   *
   * If a UI-Router Module needs to perform some configuration (such as registering
   * parameter types or Transition Hooks) a `configFn` should be supplied.
   * The function will be passed the `UIRouter` instance and the module's `Injector`
   *
   * #### Example:
   * ```js
   * import { Injector } from "@angular/core";
   * import { UIRouter } from "ui-router-ng2";
   * import { requireAuthHook } from "./requireAuthHook";
   * import { MyService } from "./myService";
   *
   * export function configureMyModule(uiRouter: UIRouter, injector: Injector) {
   *   // Get UIRouter services off the UIRouter object
   *   let urlConfig = uiRouter.urlService.config;
   *   let transitionService = uiRouter.transitionService;
   *   uiRouter.trace.enable("TRANSITION");
   *
   *   transitionService.onBefore({ to: (state) => state.requiresAuth }, requireAuthHook);
   *
   *   // Create a slug type based on the string type
   *   let builtInStringType = urlConfig.type('string');
   *   let slugType = Object.assign({}, builtInStringType, { encode: (str) => str, decode: (str) => str });
   *   urlConfig.type('slug', slugType);
   *
   *   // Inject arbitrary services from DI using the Injector argument
   *   let myService: MyService = injector.get(MyService)
   *   myService.useFastMode();
   * }
   * ```
   *
   * ```js
   * @NgModule({
   *   imports: [
   *     UIRouterModule.forChild({ states: STATES, config: configureMyModule });
   *   ]
   * })
   * class MyModule {}
   * ```
   */
  config?: (uiRouterInstance: UIRouter, injector: Injector) => any;
}

