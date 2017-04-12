/** @module ng2 */ /** */
import { UIRouter, isFunction, StateObject } from "ui-router-core";
import {StatesModule, RootModule} from "./uiRouterNgModule";
import { Ng2StateDeclaration, Ng2ViewDeclaration } from "./interface";
import { Injector, Type } from "@angular/core";
import { DirectiveResolver } from '@angular/compiler';
import {isDefined} from "ui-router-core";

export function applyModuleConfig(uiRouter: UIRouter, injector: Injector, module: StatesModule = {}): StateObject[] {
  if (isFunction(module.config)) {
    module.config(uiRouter, injector, module);
  }

  let states = module.states || [];
  validNamedViewsComponents(states);
  return states.map(state => uiRouter.stateRegistry.register(state));
}

export function applyRootModuleConfig(uiRouter: UIRouter, injector: Injector, module: RootModule) {
  isDefined(module.deferIntercept) && uiRouter.urlService.deferIntercept(module.deferIntercept);
  isDefined(module.otherwise)      && uiRouter.urlService.rules.otherwise(module.otherwise);
}

function validNamedViewsComponents(states: Ng2StateDeclaration[]) {
  for (let state of states) {
    for (let key in state.views) {
      let view: Ng2ViewDeclaration | Type<any> = state.views[key];
      if (isComponent(view)) {
        state.views[key] = { component: view };
      }
    }
  }
}

function isComponent(obj: any): obj is Type<any> {
  return isType(obj) && directiveResolver.isDirective(obj);
}

let directiveResolver = new DirectiveResolver();

// TODO: remove and use Ng implementation when upgrade to Ng4.
function isType(v: any): v is Type<any> {
  return typeof v === 'function';
}
