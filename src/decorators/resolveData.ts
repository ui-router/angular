/** @module decorators */
/** */

/**
 * An ES7 decorator which maps resolve data to a component.
 *
 * Add this decorator to a property of your component.
 * The decorator marks the component's property to receive resolve data.
 *
 * When resolve data of the same name (token) is found,
 * the resolve data will be assigned to the component's property.
 *
 * #### Example:
 *
 * The component's properties receive resolve data from the state definition.
 * ```js
 * @Component({ selector: 'foo' })
 * export class FooComponent {
 *   @Resolve() resolveToken1;
 *   @Resolve('resolveToken2') prop2;
 *   @Input() @Resolve() resolveToken3;
 * }
 *
 * const fooState = {
 *   name: 'foo',
 *   component: FooComponent,
 *   resolve: [
 *     { token: 'resolveToken1', deps: [], resolveFn: resolve1Fn },
 *     { token: 'resolveToken2', deps: [], resolveFn: resolve2Fn },
 *     { token: 'resolveToken3', deps: [], resolveFn: resolve3Fn },
 *   ]
 * }
 * ```
 *
 * @param token The resolve token to bind to this property
 *        (if omitted, the property name is used as the token)
 */
export function ResolveData(token?: string): PropertyDecorator {
  return function(target, property: string) {
    const inputs = target['__inputs'] = target['__inputs'] || {};
    token = token || property;
    inputs[token] = property;
  };
}