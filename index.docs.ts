import './@uirouter/rx';

/**
 * When generating docs with typedoc in other projects (such as @uirouter/angular)
 * the typescript `files` compilerOption is used to import directly from the
 * @uirouter/core source files instead of from the compiled lib files.
 *
 * While generating docs, we have to duplicate the @uirouter/core module augmentation
 * code but point it to the src/globals instead of lib/globals.
 */
declare module '@uirouter/core/src/globals' {
  interface UIRouterGlobals {
    states$?: Observable<StatesChangedEvent>;
    start$?: Observable<Transition>;
    success$?: Observable<Transition>;
    params$?: Observable<{ [paramName: string]: any }>;
  }
}
