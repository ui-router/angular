import { BuilderFunction, StateObject } from '@uirouter/core';
import { Ng2StateDeclaration } from '../interface';
import { loadComponent, loadNgModule } from '../lazyLoad/lazyLoadNgModule';

type LazyLoadCapableState = StateObject & Pick<Ng2StateDeclaration, 'loadChildren' | 'loadComponent'>;

/**
 * This is a [[StateBuilder.builder]] function for ngModule lazy loading in Angular.
 *
 * When the [[StateBuilder]] builds a [[State]] object from a raw [[StateDeclaration]], this builder
 * decorates the `lazyLoad` property for states that have a [[Ng2StateDeclaration.ngModule]] declaration.
 *
 * If the state has a [[Ng2StateDeclaration.ngModule]], it will create a `lazyLoad` function
 * that in turn calls `loadNgModule(loadNgModuleFn)`.
 *
 * #### Example:
 * A state that has a `ngModule`
 * ```js
 * var decl = {
 *   ngModule: () => import('./childModule.ts')
 * }
 * ```
 * would build a state with a `lazyLoad` function like:
 * ```js
 * import { loadNgModule } from "@uirouter/angular";
 * var decl = {
 *   lazyLoad: loadNgModule(() => import('./childModule.ts')
 * }
 * ```
 *
 * If the state has both a `ngModule:` *and* a `lazyLoad`, then the `lazyLoad` is run first.
 *
 * #### Example:
 * ```js
 * var decl = {
 *   lazyLoad: () => import('third-party-library'),
 *   ngModule: () => import('./childModule.ts')
 * }
 * ```
 * would build a state with a `lazyLoad` function like:
 * ```js
 * import { loadNgModule } from "@uirouter/angular";
 * var decl = {
 *   lazyLoad: () => import('third-party-library')
 *       .then(() => loadNgModule(() => import('./childModule.ts'))
 * }
 * ```
 *
 */
export function ng2LazyLoadBuilder(state: StateObject, _parent?: BuilderFunction) {
  const lazyLoadState = state as LazyLoadCapableState;
  const { loadChildren: loadNgModuleFn, loadComponent: loadComponentFn } = lazyLoadState;
  return loadComponentFn
    ? loadComponent(loadComponentFn)
    : loadNgModuleFn
      ? loadNgModule(loadNgModuleFn)
      : state.lazyLoad;
}
