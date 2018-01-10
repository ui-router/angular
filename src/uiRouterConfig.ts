/** @module ng2 */ /** */
import { UIRouter, isFunction, StateObject } from '@uirouter/core';
import {StatesModule, RootModule} from './uiRouterNgModule';
import {Injector} from '@angular/core';
import {isDefined} from '@uirouter/core';

export function applyModuleConfig(uiRouter: UIRouter, injector: Injector, module: StatesModule = {}): StateObject[] {
  if (isFunction(module.config)) {
    module.config(uiRouter, injector, module);
  }

  const states = module.states || [];
  return states.map(state => uiRouter.stateRegistry.register(state));
}

export function applyRootModuleConfig(uiRouter: UIRouter, injector: Injector, module: RootModule) {
  isDefined(module.deferIntercept) && uiRouter.urlService.deferIntercept(module.deferIntercept);
  isDefined(module.otherwise)      && uiRouter.urlService.rules.otherwise(module.otherwise);
  isDefined(module.initial)        && uiRouter.urlService.rules.initial(module.initial);
}


