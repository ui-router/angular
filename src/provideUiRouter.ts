import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { locationStrategy, makeRootProviders, RootModule } from "./uiRouterNgModule";
import { _UIROUTER_INSTANCE_PROVIDERS, _UIROUTER_SERVICE_PROVIDERS } from "./providers";

/**
 * Sets up providers necessary to enable UI-Router for the application. Intended as a replacement
 * for [[UIRouterModule.forRoot]] in newer standalone based applications.
 *
 * Example:
 * ```js
 * const routerConfig = {
 *   otherwise: '/home',
 *   states: [homeState, aboutState]
 * };
 *
 * const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideZoneChangeDetection({ eventCoalescing: true }),
 *     provideUIRouter(routerConfig)
 *   ]
 * };
 *
 * bootstrapApplication(AppComponent, appConfig)
 *  .catch((err) => console.error(err));
 * ```
 *
 * @param config declarative UI-Router configuration
 * @returns an `EnvironmentProviders` which provides the [[UIRouter]] singleton instance
 */
export function provideUIRouter(config: RootModule = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    _UIROUTER_INSTANCE_PROVIDERS,
    _UIROUTER_SERVICE_PROVIDERS,
    locationStrategy(config.useHash),
    ...makeRootProviders(config),
  ]);
}
