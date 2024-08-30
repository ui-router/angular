import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { locationStrategy, makeRootProviders, RootModule } from "./uiRouterNgModule";
import { _UIROUTER_INSTANCE_PROVIDERS, _UIROUTER_SERVICE_PROVIDERS } from "./providers";

export function provideUIRouter(config: RootModule = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    _UIROUTER_INSTANCE_PROVIDERS,
    _UIROUTER_SERVICE_PROVIDERS,
    locationStrategy(config.useHash),
    ...makeRootProviders(config),
  ]);
}
