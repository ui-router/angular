/** @ng2api @module core */ /** */
import {NgModuleFactoryLoader, NgModuleRef, Injector, NgModuleFactory, Type, Compiler} from "@angular/core";
import {Transition, LazyLoadResult, UIRouter, Resolvable, NATIVE_INJECTOR_TOKEN, isString} from "ui-router-core";
import {RootModule, StatesModule, UIROUTER_ROOT_MODULE, UIROUTER_MODULE_TOKEN} from "./uiRouterNgModule";
import {applyModuleConfig} from "./uiRouterConfig";

export type ModuleTypeCallback = () => Type<any> | Promise<Type<any>>;
export type NgModuleToLoad = string | ModuleTypeCallback;

/**
 * Returns a function which lazy loads a nested module
 *
 * Use this function as a [[StateDeclaration.lazyLoad]] property to lazy load an NgModule and its state.
 *
 * Example using `System.import()`:
 * ```js
 * {
 *   name: 'home',
 *   url: '/home',
 *   lazyLoad: loadNgModule(() => System.import('./home.module').then(result => result.HomeModule))
 * }
 * ```
 *
 * Example using `NgModuleFactoryLoader`:
 * ```js
 * {
 *   name: 'home',
 *   url: '/home',
 *   lazyLoad: loadNgModule('./home.module')
 * }
 * ```
 *
 * @param moduleToLoad
 *    If a string, it should be the path to the NgModule code, which will then be loaded by the `NgModuleFactoryLoader`.
 *    If a function, the function should load the NgModule code and return a reference to the `NgModule` class being loaded.
 *
 * @returns A function which takes a transition, which:
 * - Gets the Injector (scoped properly for the destination state)
 * - Loads and creates the NgModule
 * - Finds the "replacement state" for the target state, and adds the new NgModule Injector to it (as a resolve)
 * - Returns the new states array
 */
export function loadNgModule(moduleToLoad: NgModuleToLoad): (transition: Transition) => Promise<LazyLoadResult> {
  return function(transition: Transition) {
    const ng2Injector = transition.injector().get(NATIVE_INJECTOR_TOKEN);

    const createModule = (factory: NgModuleFactory<any>) =>
        factory.create(ng2Injector);

    const applyModule = (moduleRef: NgModuleRef<any>) =>
        applyNgModule(transition, moduleRef);

    return loadModuleFactory(moduleToLoad, ng2Injector)
        .then(createModule)
        .then(applyModule);
  }
}

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
export function loadModuleFactory(moduleToLoad: NgModuleToLoad, ng2Injector: Injector): Promise<NgModuleFactory<any>> {
  if (isString(moduleToLoad)) {
    return ng2Injector.get(NgModuleFactoryLoader).load(moduleToLoad);
  }

  const compiler: Compiler = ng2Injector.get(Compiler);
  const offlineMode = compiler instanceof Compiler;
  const loadChildrenPromise = Promise.resolve(moduleToLoad());
  const compileAsync = (moduleType: Type<any>) =>
      compiler.compileModuleAsync(moduleType);

  return offlineMode ? loadChildrenPromise : loadChildrenPromise.then(compileAsync)
}

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
export function applyNgModule(transition: Transition, ng2Module: NgModuleRef<any>): LazyLoadResult {
  let injector = ng2Module.injector;
  let parentInjector = <Injector> ng2Module.injector['parent'];
  let uiRouter: UIRouter = injector.get(UIRouter);

  let originalName = transition.to().name;
  let originalState = uiRouter.stateRegistry.get(originalName);

  let newRootModules: RootModule[] = multiProviderParentChildDelta(parentInjector, injector, UIROUTER_ROOT_MODULE);

  if (newRootModules.length) {
    console.log(newRootModules);
    throw new Error('Lazy loaded modules should not contain a UIRouterModule.forRoot() module');
  }

  let newModules: RootModule[] = multiProviderParentChildDelta(parentInjector, injector, UIROUTER_MODULE_TOKEN);
  newModules.forEach(module => applyModuleConfig(uiRouter, injector, module));

  let replacementState = uiRouter.stateRegistry.get(originalName);
  if (replacementState === originalState) {
    throw new Error(`The Future State named '${originalName}' lazy loaded an NgModule. That NgModule should also have a UIRouterModule.forChild() state named '${originalName}' to replace the Future State, but it did not.`);
  }

  // Supply the newly loaded states with the Injector from the lazy loaded NgModule
  replacementState.$$state().resolvables.push(Resolvable.fromData(NATIVE_INJECTOR_TOKEN, injector));

  return {};
}

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
export function multiProviderParentChildDelta(parent: Injector, child: Injector, token: any) {
  let childVals: RootModule[] = child.get(token);
  let parentVals: RootModule[] = parent.get(token);
  return childVals.filter(val => parentVals.indexOf(val) === -1);
}