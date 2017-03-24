/** @module ng2 */ /** */
import { UIRouter, StateObject } from "ui-router-core";
import { StatesModule, RootModule } from "./uiRouterNgModule";
import { Injector } from "@angular/core";
export declare function applyModuleConfig(uiRouter: UIRouter, injector: Injector, module?: StatesModule): StateObject[];
export declare function applyRootModuleConfig(uiRouter: UIRouter, injector: Injector, module: RootModule): void;
