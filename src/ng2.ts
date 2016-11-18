/** @module ng2 */ /** for typedoc */
export * from "ui-router-core";
import "ui-router-core/lib/justjs";

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/map';

export * from "./ng2/interface";
export * from "./ng2/lazyLoadNgModule";
export * from "./ng2/rx";
export * from "./ng2/providers";
export * from "./ng2/location";
export * from "./ng2/directives/directives";
export * from "./ng2/statebuilders/views";
export * from "./ng2/uiRouterNgModule";
export * from "./ng2/uiRouterConfig";
