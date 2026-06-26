import { UIRouter, isDefined, isFunction, StateObject } from '@uirouter/core';
import { StatesModule, RootModule } from './uiRouterNgModule';
import { Injector } from '@angular/core';

export function applyModuleConfig(uiRouter: UIRouter, injector: Injector, module: StatesModule = {}): StateObject[] {
  if (isFunction(module.config)) {
    module.config(uiRouter, injector, module);
  }

  const states = module.states || [];
  return states.map((state) => uiRouter.stateRegistry.register(state));
}

export function applyRootModuleConfig(uiRouter: UIRouter, injector: Injector, module: RootModule) {
  const { initial, otherwise } = module;
  if (isDefined(module.deferIntercept)) uiRouter.urlService.deferIntercept(module.deferIntercept);
  if (otherwise !== undefined) uiRouter.urlService.rules.otherwise(otherwise);
  if (initial !== undefined) uiRouter.urlService.rules.initial(initial);
}
