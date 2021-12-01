import { NgModuleRef, Injector, NgModuleFactory, Type, Compiler } from '@angular/core';
import {
  Transition,
  LazyLoadResult,
  UIRouter,
  Resolvable,
  NATIVE_INJECTOR_TOKEN,
  isString,
  unnestR,
  inArray,
  StateObject,
  uniqR,
  StateDeclaration,
} from '@uirouter/core';
import { UIROUTER_MODULE_TOKEN, UIROUTER_ROOT_MODULE } from '../injectionTokens';
import { RootModule, StatesModule } from '../uiRouterNgModule';
import { applyModuleConfig } from '../uiRouterConfig';

/**
 * A function that returns an NgModule, or a promise for an NgModule
 *
 * #### Example:
 * ```js
 * export function loadFooModule() {
 *   return import('../foo/foo.module').then(result => result.FooModule);
 * }
 * ```
 */
export type ModuleTypeCallback = () => Type<any> | Promise<Type<any>>;

/**
 * Returns a function which lazy loads a nested module
 *
 * This is primarily used by the [[ng2LazyLoadBuilder]] when processing [[Ng2StateDeclaration.loadChildren]].
 *
 * It could also be used manually as a [[StateDeclaration.lazyLoad]] property to lazy load an `NgModule` and its state(s).
 *
 * #### Example:
 * Using `import()` and named export of `HomeModule`
 * ```js
 * declare var System;
 * var futureState = {
 *   name: 'home.**',
 *   url: '/home',
 *   lazyLoad: loadNgModule(() => import('./home/home.module').then(result => result.HomeModule))
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
export function loadNgModule(
  moduleToLoad: ModuleTypeCallback
): (transition: Transition, stateObject: StateDeclaration) => Promise<LazyLoadResult> {
  return (transition: Transition, stateObject: StateDeclaration) => {
    const ng2Injector = transition.injector().get(NATIVE_INJECTOR_TOKEN);

    const createModule = (factory: NgModuleFactory<any>) => factory.create(ng2Injector);

    const applyModule = (moduleRef: NgModuleRef<any>) => applyNgModule(transition, moduleRef, ng2Injector, stateObject);

    return loadModuleFactory(moduleToLoad, ng2Injector).then(createModule).then(applyModule);
  };
}

/**
 * Returns the module factory that can be used to instantiate a module
 *
 * For a Type<any> or Promise<Type<any>> this:
 * - Compiles the component type (if not running with AOT)
 * - Returns the NgModuleFactory resulting from compilation (or direct loading if using AOT) as a Promise
 *
 * @internal
 */
export function loadModuleFactory(
  moduleToLoad: ModuleTypeCallback,
  ng2Injector: Injector
): Promise<NgModuleFactory<any>> {
  const compiler: Compiler = ng2Injector.get(Compiler);

  const unwrapEsModuleDefault = (x) => (x && x.__esModule && x['default'] ? x['default'] : x);

  return Promise.resolve(moduleToLoad())
    .then(unwrapEsModuleDefault)
    .then((t: NgModuleFactory<any> | Type<any>) => {
      if (t instanceof NgModuleFactory) {
        return t;
      }
      return compiler.compileModuleAsync(t);
    });
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
 * @internal
 */
export function applyNgModule(
  transition: Transition,
  ng2Module: NgModuleRef<any>,
  parentInjector: Injector,
  lazyLoadState: StateDeclaration
): LazyLoadResult {
  const injector = ng2Module.injector;
  const uiRouter: UIRouter = injector.get(UIRouter);
  const registry = uiRouter.stateRegistry;

  const originalName = lazyLoadState.name;
  const originalState = registry.get(originalName);
  // Check if it's a future state (ends with .**)
  const isFuture = /^(.*)\.\*\*$/.exec(originalName);
  // Final name (without the .**)
  const replacementName = isFuture && isFuture[1];

  const newRootModules = multiProviderParentChildDelta(parentInjector, injector, UIROUTER_ROOT_MODULE).reduce(
    uniqR,
    []
  ) as RootModule[];
  const newChildModules = multiProviderParentChildDelta(parentInjector, injector, UIROUTER_MODULE_TOKEN).reduce(
    uniqR,
    []
  ) as StatesModule[];

  if (newRootModules.length) {
    console.log(newRootModules); // tslint:disable-line:no-console
    throw new Error('Lazy loaded modules should not contain a UIRouterModule.forRoot() module');
  }

  const newStateObjects: StateObject[] = newChildModules
    .map((module) => applyModuleConfig(uiRouter, injector, module))
    .reduce(unnestR, [])
    .reduce(uniqR, []);

  if (isFuture) {
    const replacementState = registry.get(replacementName);
    if (!replacementState || replacementState === originalState) {
      throw new Error(
        `The Future State named '${originalName}' lazy loaded an NgModule. ` +
          `The lazy loaded NgModule must have a state named '${replacementName}' ` +
          `which replaces the (placeholder) '${originalName}' Future State. ` +
          `Add a '${replacementName}' state to the lazy loaded NgModule ` +
          `using UIRouterModule.forChild({ states: CHILD_STATES }).`
      );
    }
  }

  // Supply the newly loaded states with the Injector from the lazy loaded NgModule.
  // If a tree of states is lazy loaded, only add the injector to the root of the lazy loaded tree.
  // The children will get the injector by resolve inheritance.
  const newParentStates = newStateObjects.filter((state) => !inArray(newStateObjects, state.parent));

  // Add the Injector to the top of the lazy loaded state tree as a resolve
  newParentStates.forEach((state) => state.resolvables.push(Resolvable.fromData(NATIVE_INJECTOR_TOKEN, injector)));

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
 * @internal
 */
export function multiProviderParentChildDelta(parent: Injector, child: Injector, token: any) {
  const childVals: RootModule[] = child.get(token, []);
  const parentVals: RootModule[] = parent.get(token, []);
  return childVals.filter((val) => parentVals.indexOf(val) === -1);
}
