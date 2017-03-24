/** @ng2api @module core */
/** */
import { NgModuleRef, Injector, NgModuleFactory, Type } from "@angular/core";
import { Transition, LazyLoadResult } from "ui-router-core";
import { RootModule } from "../uiRouterNgModule";
/**
 * A function that returns an NgModule, or a promise for an NgModule
 *
 * #### Example:
 * ```js
 * export function loadFooModule() {
 *   return System.import('../foo/foo.module').then(result => result.FooModule);
 * }
 * ```
 */
export declare type ModuleTypeCallback = () => Type<any> | Promise<Type<any>>;
/**
 * A string or a function which lazy loads a module
 *
 * If a string, should conform to the Angular Router `loadChildren` string.
 * #### Example:
 * ```
 * var ngModuleToLoad = './foo/foo.module#FooModule'
 * ```
 *
 * For functions, see: [[ModuleTypeCallback]]
 */
export declare type NgModuleToLoad = string | ModuleTypeCallback;
/**
 * Returns a function which lazy loads a nested module
 *
 * This is primarily used by the [[ng2LazyLoadBuilder]] when processing [[Ng2StateDeclaration.loadChildren]].
 *
 * It could also be used manually as a [[StateDeclaration.lazyLoad]] property to lazy load an `NgModule` and its state(s).
 *
 * #### Example:
 * Using `System.import()` and named export of `HomeModule`
 * ```js
 * declare var System;
 * var futureState = {
 *   name: 'home.**',
 *   url: '/home',
 *   lazyLoad: loadNgModule(() => System.import('./home/home.module').then(result => result.HomeModule))
 * }
 * ```
 *
 * #### Example:
 * Using a path (string) to the module
 * ```js
 * var futureState = {
 *   name: 'home.**',
 *   url: '/home',
 *   lazyLoad: loadNgModule('./home/home.module#HomeModule')
 * }
 * ```
 *
 *
 * @param moduleToLoad a path (string) to the NgModule to load.
 *    Or a function which loads the NgModule code which should
 *    return a reference to  the `NgModule` class being loaded (or a `Promise` for it).
 *
 * @returns A function which takes a transition, which:
 * - Gets the Injector (scoped properly for the destination state)
 * - Loads and creates the NgModule
 * - Finds the "replacement state" for the target state, and adds the new NgModule Injector to it (as a resolve)
 * - Returns the new states array
 */
export declare function loadNgModule(moduleToLoad: NgModuleToLoad): (transition: Transition) => Promise<LazyLoadResult>;
/**
 * Returns the module factory that can be used to instantiate a module
 *
 * For strings this:
 * - Finds the correct NgModuleFactoryLoader
 * - Loads the new NgModuleFactory from the path string (async)
 *
 * For a Type<any> or Promise<Type<any>> this:
 * - Compiles the component type (if not running with AOT)
 * - Returns the NgModuleFactory resulting from compilation (or direct loading if using AOT) as a Promise
 *
 * @internalapi
 */
export declare function loadModuleFactory(moduleToLoad: NgModuleToLoad, ng2Injector: Injector): Promise<NgModuleFactory<any>>;
/**
 * Apply the UI-Router Modules found in the lazy loaded module.
 *
 * Apply the Lazy Loaded NgModule's newly created Injector to the right state in the state tree.
 *
 * Lazy loading uses a placeholder state which is removed (and replaced) after the module is loaded.
 * The NgModule should include a state with the same name as the placeholder.
 *
 * Find the *newly loaded state* with the same name as the *placeholder state*.
 * The NgModule's Injector (and ComponentFactoryResolver) will be added to that state.
 * The Injector/Factory are used when creating Components for the `replacement` state and all its children.
 *
 * @internalapi
 */
export declare function applyNgModule(transition: Transition, ng2Module: NgModuleRef<any>): LazyLoadResult;
/**
 * Returns the new dependency injection values from the Child Injector
 *
 * When a DI token is defined as multi: true, the child injector
 * can add new values for the token.
 *
 * This function returns the values added by the child injector,  and excludes all values from the parent injector.
 *
 * @internalapi
 */
export declare function multiProviderParentChildDelta(parent: Injector, child: Injector, token: any): RootModule[];
