/** @module ng2 */
/** */
import {BuilderFunction, LazyLoadResult, StateDeclaration, StateObject, Transition} from "@uirouter/core";
import {loadNgModule} from "../lazyLoad/lazyLoadNgModule";

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
 *   ngModule: () => System.import('./childModule.ts')
 * }
 * ```
 * would build a state with a `lazyLoad` function like:
 * ```js
 * import { loadNgModule } from "@uirouter/angular";
 * var decl = {
 *   lazyLoad: loadNgModule(() => System.import('./childModule.ts')
 * }
 * ```
 *
 * If the state has both a `ngModule:` *and* a `lazyLoad`, then the `lazyLoad` is run first.
 *
 * #### Example:
 * ```js
 * var decl = {
 *   lazyLoad: () => System.import('third-party-library'),
 *   ngModule: () => System.import('./childModule.ts')
 * }
 * ```
 * would build a state with a `lazyLoad` function like:
 * ```js
 * import { loadNgModule } from "@uirouter/angular";
 * var decl = {
 *   lazyLoad: () => System.import('third-party-library')
 *       .then(() => loadNgModule(() => System.import('./childModule.ts'))
 * }
 * ```
 *
 */
export function ng2LazyLoadBuilder(state: StateObject, parent: BuilderFunction): ((transition: Transition, state?: StateDeclaration) => Promise<LazyLoadResult>) {
  let loadNgModuleFn = state['loadChildren'];
  return loadNgModuleFn ? loadNgModule(loadNgModuleFn) : state.lazyLoad;
}
