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
import { UIRouter, StateRegistry, StateService, TransitionService, UrlMatcherFactory, UrlRouter, ViewService, UrlService } from "@uirouter/core";
import { ParentUIViewInject } from "./directives/uiView";
import { RootModule, StatesModule } from "./uiRouterNgModule";
import { LocationStrategy } from "@angular/common";
/**
 * This is a factory function for a UIRouter instance
 *
 * Creates a UIRouter instance and configures it for Angular, then invokes router bootstrap.
 * This function is used as an Angular `useFactory` Provider.
 */
export declare function uiRouterFactory(locationStrategy: LocationStrategy, rootModules: RootModule[], modules: StatesModule[], injector: Injector): UIRouter;
export declare function parentUIViewInjectFactory(r: StateRegistry): ParentUIViewInject;
export declare const _UIROUTER_INSTANCE_PROVIDERS: Provider[];
export declare function fnStateService(r: UIRouter): StateService;
export declare function fnTransitionService(r: UIRouter): TransitionService;
export declare function fnUrlMatcherFactory(r: UIRouter): UrlMatcherFactory;
export declare function fnUrlRouter(r: UIRouter): UrlRouter;
export declare function fnUrlService(r: UIRouter): UrlService;
export declare function fnViewService(r: UIRouter): ViewService;
export declare function fnStateRegistry(r: UIRouter): StateRegistry;
export declare function fnGlobals(r: any): any;
export declare const _UIROUTER_SERVICE_PROVIDERS: Provider[];
/**
 * The UI-Router providers, for use in your application bootstrap
 *
 * @deprecated use [[UIRouterModule.forRoot]]
 */
export declare const UIROUTER_PROVIDERS: Provider[];
