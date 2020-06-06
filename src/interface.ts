import { StateDeclaration, _ViewDeclaration, Transition, HookResult } from '@uirouter/core';
import { Component, Type } from '@angular/core';
import { ModuleTypeCallback } from './lazyLoad/lazyLoadNgModule';

/**
 * The StateDeclaration object is used to define a state or nested state.
 * It should be registered with the [[StateRegistry]].
 *
 * #### Example:
 * ```js
 * import {FoldersComponent} from "./folders";
 *
 * export function getAllFolders(FolderService) {
 *   return FolderService.list();
 * }
 *
 * // StateDeclaration object
 * export let foldersState = {
 *   name: 'folders',
 *   url: '/folders',
 *   component: FoldersComponent,
 *   resolve: [
 *     { token: 'allfolders', deps: [FolderService], resolveFn: getAllFolders }
 *   ]
 * }
 * ```
 */
export interface Ng2StateDeclaration extends StateDeclaration, Ng2ViewDeclaration {
  /**
   * An optional object used to define multiple named views.
   *
   * Each key is the name of a view, and each value is a [[Ng2ViewDeclaration]].
   * Unnamed views are internally renamed to `$default`.
   *
   * A view's name is used to match an active `<ui-view>` directive in the DOM.  When the state
   * is entered, the state's views are activated and then matched with active `<ui-view>` directives:
   *
   * - The view's name is processed into a ui-view target:
   *   - ui-view address: an address to a ui-view
   *   - state anchor: the state to anchor the address to
   *
   *  Examples:
   *
   *  Targets three named ui-views in the parent state's template
   *
   * #### Example:
   * ```js
   * views: {
   *   header: {component: HeaderComponent},
   *   body: {component: BodyComponent},
   *   footer: {component: FooterComponent}
   * }
   * ```
   *
   * #### Example:
   * ```js
   * // Targets named ui-view="header" in the template of the ancestor state 'top'
   * // and the named `ui-view="body" from the parent state's template.
   * views: {
   *   'header@top': {component: MsgHeaderComponent},
   *   'body': {component: MessagesComponent}
   * }
   * ```
   *
   * ## View targeting details
   *
   * There are a few styles of view addressing/targeting.  The most common is a simple `ui-view` name
   *
   *
   * #### Simple ui-view name
   *
   * Addresses without an `@` are anchored to the parent state.
   *
   * #### Example:
   * ```js
   * // target the `<div ui-view='foo'></div>` created in the parent state's view
   * views: { foo: {...} }
   * ```
   *
   * #### View name anchored to a state
   *
   * You can anchor the `ui-view` name to a specific state by including an `@`
   *
   * @example
   *
   * ```js
   *
   * // target the `<div ui-view='foo'></div>` which was created in a
   * // view owned by the state `bar.baz`
   * views: { 'foo@bar.baz': {...} }
   * ```
   *
   * #### Absolute addressing
   *
   * You can address a `ui-view` absolutely, using dotted notation, by prefixing the address with a `!`.  Dotted
   * addresses map to the hierarchy of `ui-view`s active in the DOM:
   *
   * #### Example:
   * ```js
   * // absolutely target the `<div ui-view='nested'></div>`... which was created
   * // in the unnamed/$default root `<ui-view></ui-view>`
   * views: { '!$default.nested': {...} }
   * ```
   *
   * #### Relative addressing
   *
   * Absolute addressing is actually relative addressing, only anchored to the unnamed root state.  You can also use
   * relative addressing anchored to any state, in order to target a target deeply nested `ui-views`:
   *
   * #### Example:
   * ```js
   *
   * // target the `<div ui-view='bar'></div>`... which was created inside the
   * // `<div ui-view='bar'></div>`... which was created inside the parent state's template.
   * views: { 'foo.bar': {...} }
   * ```
   *
   * #### Example:
   * ```js
   * // target the `<div ui-view='bar'></div>`...  which was created in
   * // `<div ui-view='foo'></div>`... which was created in a template crom the state `baz.qux`
   * views: { 'foo.bar@baz.qux': {...} }
   *
   * ---
   *
   * ## State `component:` and `views:` incompatiblity
   *
   * If a state has a `views` object, the state-level `component:` property is ignored.  Therefore,
   * if _any view_ for a state is declared in the `views` object, then _all of the state's views_ must be defined in
   * the `views` object.
   */
  views?: { [key: string]: Ng2ViewDeclaration };

  /**
   * A function used to lazy load an `NgModule`
   *
   * The `loadChildren` property should be added to a Future State (a lazy loaded state whose name ends in `.**`).
   * The Future State is a placeholder for a tree of states that will be lazy loaded in the future.
   *
   * When the future state is activated, the `loadChildren` property should lazy load an `NgModule`
   * which contains the fully loaded states.
   * The `NgModule` should contain the fully loaded states which will be registered.
   * The fully loaded states will replace the temporary future states once lazy loading is complete.
   *
   * #### Example:
   * ```js
   * var futureState = {
   *   name: 'home.**',
   *   url: '/home',
   *   loadChildren: () => import('./home/home.module')
   *       .then(result => result.HomeModule);
   * }
   * ```
   */
  loadChildren?: ModuleTypeCallback;
}

export interface Ng2ViewDeclaration extends _ViewDeclaration {
  /**
   * The `Component` class to use for this view.
   *
   * A property of [[Ng2StateDeclaration]] or [[Ng2ViewDeclaration]]:
   *
   * ### The component class which will be used for this view.
   *
   * #### Example:
   * ```js
   * .state('profile', {
   *   // Use the <my-profile></my-profile> component for the Unnamed view
   *   component: MyProfileComponent,
   * }
   *
   * .state('messages', {
   *   // use the <nav-bar></nav-bar> component for the view named 'header'
   *   // use the <message-list></message-list> component for the view named 'content'
   *   views: {
   *     header: { component: NavBar },
   *     content: { component: MessageList }
   *   }
   * }
   *
   * // Named views shorthand:
   * // Inside a "views:" block, a Component class (NavBar) is shorthand for { component: NavBar }
   * .state('contacts', {
   *   // use the <nav-bar></nav-bar> component for the view named 'header'
   *   // use the <contact-list></contact-list> component for the view named 'content'
   *   views: {
   *     header: NavBar,
   *     content: ContactList
   *   }
   * }
   * ```
   *
   * ### Accessing Resolve Data
   *
   * The component can access the Transition's [[Ng2StateDeclaration.resolve]] data in one of two ways:
   *
   * 1) Using Dependency Injection in the component constructor
   *
   * (using Typescript)
   * ```js
   * class MyComponent {
   *   constructor(@Inject("myResolveData") public resolveValueA, resolveValueB: public SomeClass) {
   *   }
   * }
   * ```
   *
   * (using ES6/7/babel)
   * ```js
   * class MyComponent {
   *   static get parameters() {
   *     return [["myResolveData"], [MyResolveClass]];
   *   }
   *   constructor(resolveValueA, resolveValueB) {
   *     this.resolveValueA = resolveValueA;
   *     this.resolveValueB = resolveValueB;
   *   }
   * }
   * ```
   *
   * See also: https://github.com/shuhei/babel-plugin-angular2-annotations
   *
   * 2) Using a component input
   *
   * Note: To bind a resolve to a component input, the resolves must `provide:` a string value
   *
   * ```js
   * @Component() {
   *   inputs: ['resolveValueA']
   * }
   * class MyComponent {
   *   myResolveValueA;
   *   @Input() resolveValueB;
   *   @Input("resolveValueC") resolveValueC;
   *
   *   constructor() {
   *   }
   * }
   * ```
   */
  component?: Type<any>;

  /**
   * An object which maps `resolve` keys to [[component]] `bindings`.
   *
   * A property of [[Ng2StateDeclaration]] or [[Ng2ViewDeclaration]]:
   *
   * When using a [[component]] declaration (`component: MyComponent`), each input binding for the component is supplied
   * data from a resolve of the same name, by default.  You may supply data from a different resolve name by mapping it here.
   * This might be useful if you want to reuse the same resolve value with various components with different input binding names.
   *
   * Each key in this object is the name of one of the component's input bindings.
   * Each value is the name of the resolve that should be provided to that binding.
   *
   * Any component bindings that are omitted from this map get the default behavior of mapping to a resolve of the * same name.
   *
   * #### Example:
   * ```js
   * export const fooState = {
   *   name: 'foo',
   *   component: MyComponent,
   *   resolve: [
   *     { token: 'users', deps: [UserService], resolveFn: getUsers }
   *   ],
   *   bindings: {
   *     resolveData: 'users'
   *   }
   * }
   *
   * export function getUsers(userservice) {
   *   return userservice.getUsers();
   * }
   *
   * @Component() {
   * }
   * class MyComponent {
   *   @Input() resolveData;
   *   constructor() { }
   * }
   * ```
   *
   */
  bindings?: { [key: string]: string };
}

export interface UiOnParamsChanged {
  /**
   * A UI-Router view has an Angular `Component` (see [[Ng2ViewDeclaration.component]]).
   * The `Component` may define component-level hooks which UI-Router will call at the appropriate times.
   * These callbacks are similar to Transition Hooks ([[IHookRegistry]]), but are only called if the view/component is currently active.
   *
   * The uiOnParamsChanged callback is called when parameter values change.
   *
   * This callback is used to respond dynamic parameter values changing.
   * It is called when a transition changed one or more dynamic parameter values,
   * and the routed component was not destroyed.
   *
   * It receives two parameters:
   *
   * - An object with (only) changed parameter values.
   *   The keys are the parameter names and the values are the new parameter values.
   * - The [[Transition]] which changed the parameter values.
   *
   * #### Example:
   * ```js
   * @Component({
   *   template: '<input type="text">'
   * })
   * class MyComponent {
   *   uiOnParamsChanged(newParams: { [paramName: string]: any }, trans: Transition) {
   *     Object.keys(newParams).forEach(paramName => {
   *       console.log(`${paramName} changed to ${newParams[paramName]}`)
   *     });
   *   }
   * }
   * ```
   */
  uiOnParamsChanged(newParams: { [paramName: string]: any }, trans?: Transition): void;
}

export interface UiOnExit {
  /**
   * A UI-Router view has an Angular `Component` (see [[Ng2ViewDeclaration.component]]).
   * The `Component` may define component-level hooks which UI-Router will call at the appropriate times.
   * These callbacks are similar to Transition Hooks ([[IHookRegistry]]), but are only called if the view/component is currently active.
   *
   * The uiCanExit callback is called when the routed component's state is about to be exited.
   *
   * The callback can be used to cancel or alter the new Transition that would otherwise exit the component's state.
   *
   * This callback is used to inform a view that it is about to be exited, due to a new [[Transition]].
   * The callback can ask for user confirmation, and cancel or alter the new Transition.  The callback should
   * return a value, or a promise for a value.  If a promise is returned, the new Transition waits until the
   * promise settles.
   *
   * Called when:
   * - The component is still active inside a `ui-view`
   * - A new Transition is about to run
   * - The new Transition will exit the view's state
   *
   * Called with:
   * - The `Transition` that is about to exit the component's state
   *
   * #### Example:
   * ```js
   * @Component({
   *   template: '<input type="text">'
   * })
   * class MyComponent {
   *   dirty = true;
   *
   *   constructor(public confirmService: confirmService) {
   *
   *   }
   *
   *   uiCanExit(newTransition: Transition) {
   *     if (this.dirty && newTransition.to() !== 'logout') {
   *       return this.confirmService.confirm("Exit without saving changes?");
   *     }
   *   }
   * }
   * ```
   *
   * @return a hook result which may cancel or alter the pending Transition (see [[HookResult]])
   */
  uiCanExit(newTransition?: Transition): HookResult;
}

/**
 * The shape of a controller for a view (and/or component), defining the controller callbacks.
 *
 * A UI-Router view has an Angular `Component` (see [[Ng2ViewDeclaration.component]]).
 * The `Component` may define component-level hooks which UI-Router will call at the appropriate times.
 * These callbacks are similar to Transition Hooks ([[IHookRegistry]]), but are only called if the view/component is currently active.
 *
 * This interface defines the UI-Router component callbacks.
 *
 * @deprecated This interface has been replaced by UiOnExit and UiOnParamsChanged.
 */
export interface Ng2Component extends Component {
  /**
   * This callback is called when parameter values change
   *
   * This callback is used to respond dynamic parameter values changing.
   * It is called when a transition changed one or more dynamic parameter values,
   * and the routed component was not destroyed.
   *
   * It receives two parameters:
   *
   * - An object with (only) changed parameter values.
   *   The keys are the parameter names and the values are the new parameter values.
   * - The [[Transition]] which changed the parameter values.
   *
   * #### Example:
   * ```js
   * @Component({
   *   template: '<input type="text">'
   * })
   * class MyComponent {
   *   uiOnParamsChanged(newParams: { [paramName: string]: any }, trans: Transition) {
   *     Object.keys(newParams).forEach(paramName => {
   *       console.log(`${paramName} changed to ${newParams[paramName]}`)
   *     });
   *   }
   * }
   * ```
   */
  uiOnParamsChanged?(newParams: { [paramName: string]: any }, trans?: Transition): void;

  /**
   * This callback is called when the routed component's state is about to be exited.
   *
   * The callback can be used to cancel or alter the new Transition that would otherwise exit the component's state.
   *
   * This callback is used to inform a view that it is about to be exited, due to a new [[Transition]].
   * The callback can ask for user confirmation, and cancel or alter the new Transition.  The callback should
   * return a value, or a promise for a value.  If a promise is returned, the new Transition waits until the
   * promise settles.
   *
   * Called when:
   * - The component is still active inside a `ui-view`
   * - A new Transition is about to run
   * - The new Transition will exit the view's state
   *
   * Called with:
   * - The `Transition` that is about to exit the component's state
   *
   * #### Example:
   * ```js
   * @Component({
   *   template: '<input type="text">'
   * })
   * class MyComponent {
   *   dirty = true;
   *
   *   constructor(public confirmService: confirmService) {
   *
   *   }
   *
   *   uiCanExit(newTransition: Transition) {
   *     if (this.dirty && newTransition.to() !== 'logout') {
   *       return this.confirmService.confirm("Exit without saving changes?");
   *     }
   *   }
   * }
   * ```
   *
   * @return a hook result which may cancel or alter the pending Transition (see [[HookResult]])
   */
  uiCanExit?(newTransition?: Transition): HookResult;
}
