/** @module ng2 */ /** */
import { isFunction } from "ui-router-core";
import { isDefined } from "ui-router-core";
export function applyModuleConfig(uiRouter, injector, module) {
    if (module === void 0) { module = {}; }
    if (isFunction(module.config)) {
        module.config(uiRouter, injector, module);
    }
    var states = module.states || [];
    return states.map(function (state) { return uiRouter.stateRegistry.register(state); });
}
export function applyRootModuleConfig(uiRouter, injector, module) {
    isDefined(module.deferIntercept) && uiRouter.urlService.deferIntercept(module.deferIntercept);
    isDefined(module.otherwise) && uiRouter.urlService.rules.otherwise(module.otherwise);
}
//# sourceMappingURL=uiRouterConfig.js.map