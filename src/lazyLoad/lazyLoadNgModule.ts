import { NgModuleRef, Injector, Type, createNgModule, InjectionToken, isStandalone } from '@angular/core';
import {
  Transition,
  LazyLoadResult,
  UIRouter,
  Resolvable,
  NATIVE_INJECTOR_TOKEN,
  unnestR,
  inArray,
  StateObject,
  uniqR,
  StateDeclaration,
} from '@uirouter/core';
import { UIROUTER_MODULE_TOKEN, UIROUTER_ROOT_MODULE } from '../injectionTokens';
import { RootModule, StatesModule } from '../uiRouterNgModule';
import { applyModuleConfig } from '../uiRouterConfig';
import { Ng2StateDeclaration } from '../interface';

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
export type ModuleTypeCallback<T = unknown> = () => Type<T> | Promise<Type<T>>;

/**
 * Returns a function which lazy loads a nested module
 *
 * This is primarily used by the [[ng2LazyLoadBuilder]] when processing [[Ng2StateDeclaration.loadChildren]].
 *
 * It could also be used manually as a [[StateDeclaration.lazyLoad]] property to lazy load an `NgModule` and its state(s).
 *
 * #### Example:
 * ```ts
 * var futureState = {
 *   name: 'home.**',
 *   url: '/home',
 *   lazyLoad: loadNgModule(() => import('./home/home.module').then(result => result.HomeModule))
 * }
 * ```
 *
 *
 * @param moduleToLoad function which loads the NgModule code which should
 *    return a reference to  the `NgModule` class being loaded (or a `Promise` for it).
 *
 * @returns A function which takes a transition, which:
 * - Gets the Injector (scoped properly for the destination state)
 * - Loads and creates the NgModule
 * - Finds the "replacement state" for the target state, and adds the new NgModule Injector to it (as a resolve)
 * - Returns the new states array
 */
export function loadNgModule<T>(
  moduleToLoad: ModuleTypeCallback<T>
): (transition: Transition, stateObject: StateDeclaration) => Promise<LazyLoadResult> {
  return (transition: Transition, stateObject: StateDeclaration) => {

    const ng2Injector = transition.injector().get(NATIVE_INJECTOR_TOKEN);

    return loadModuleFactory(moduleToLoad, ng2Injector)
      .then(moduleRef => applyNgModule(moduleRef, ng2Injector, stateObject));
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
export function loadModuleFactory<T>(
  moduleToLoad: ModuleTypeCallback<T>,
  ng2Injector: Injector
): Promise<NgModuleRef<T>> {

  return Promise.resolve(moduleToLoad())
    .then(_unwrapEsModuleDefault)
    .then((t: Type<T>) => createNgModule(t, ng2Injector));
}

function _unwrapEsModuleDefault(x) {
  return x && x.__esModule && x['default'] ? x['default'] : x;
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
export function applyNgModule<T>(
  ng2Module: NgModuleRef<T>,
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
export function multiProviderParentChildDelta<T>(parent: Injector, child: Injector, token: InjectionToken<T>): RootModule[] {
  const childVals: RootModule[] = child.get<RootModule[]>(token, []);
  const parentVals: RootModule[] = parent.get<RootModule[]>(token, []);
  return childVals.filter((val) => parentVals.indexOf(val) === -1);
}

/**
 * A function that returns a Component, or a promise for a Component
 *
 * #### Example:
 * ```ts
 * export function loadFooComponent() {
 *   return import('../foo/foo.component').then(result => result.FooComponent);
 * }
 * ```
 */
export type ComponentTypeCallback<T> = ModuleTypeCallback<T>;

/**
 * Returns a function which lazy loads a standalone component for the target state
 *
 * #### Example:
 * ```ts
 * var futureComponentState = {
 *   name: 'home',
 *   url: '/home',
 *   lazyLoad: loadComponent(() => import('./home.component').then(result => result.HomeComponent))
 * }
 * ```
 *
 * @param callback function which loads the Component code which should
 *    return a reference to  the `Component` class being loaded (or a `Promise` for it).
 *
 * @returns A function which takes a transition, stateObject, and:
 * - Loads a standalone component
 * - replaces the component configuration of the stateObject.
 * - Returns the new states array
 */
export function loadComponent<T>(
  callback: ComponentTypeCallback<T>
): (transition: Transition, stateObject: Ng2StateDeclaration) => Promise<LazyLoadResult> {
  return (transition: Transition, stateObject: Ng2StateDeclaration) => {

    return Promise.resolve(callback())
      .then(_unwrapEsModuleDefault)
      .then((component: Type<T>) => applyComponent(component, transition, stateObject))
  }
}

/**
 * Apply the lazy-loaded component to the stateObject.
 *
 * @internal
 * @param component reference to the component class
 * @param transition Transition object reference
 * @param stateObject target state configuration object
 *
 * @returns the new states array
 */
export function applyComponent<T>(
  component: Type<T>,
  transition: Transition,
  stateObject: Ng2StateDeclaration
): LazyLoadResult {

  if (!isStandalone(component)) throw new Error("Is not a standalone component.");

  const registry = transition.router.stateRegistry;
  const current = stateObject.component;
  stateObject.component = component || current;
  const removed = registry.deregister(stateObject).map(child => child.self);
  const children = removed.filter(i => i.name != stateObject.name);

  return { states: [stateObject, ...children] }
}
