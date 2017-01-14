/** @module ng2 */ /** */
import {UIRouter} from "ui-router-core";
import {StatesModule, RootModule} from "./uiRouterNgModule";
import {Injector} from "@angular/core";
import {isDefined} from "ui-router-core";

export function applyModuleConfig(uiRouter: UIRouter, injector: Injector, options: StatesModule) {
  if (options.configClass) {
    injector.get(options.configClass);
  }

  let states = options.states || [];
  states.forEach(state => uiRouter.stateRegistry.register(state));
}

export function applyRootModuleConfig(uiRouter: UIRouter, injector: Injector, config: RootModule) {
  isDefined(config.deferIntercept) && uiRouter.urlService.deferIntercept(config.deferIntercept);
  isDefined(config.otherwise)      && uiRouter.urlService.rules.otherwise(config.otherwise);
}


