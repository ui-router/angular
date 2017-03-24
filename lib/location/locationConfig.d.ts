/** @module ng2 */
/** */
import { UIRouter, BrowserLocationConfig } from "ui-router-core";
import { LocationStrategy } from "@angular/common";
export declare class Ng2LocationConfig extends BrowserLocationConfig {
    private _locationStrategy;
    constructor(router: UIRouter, _locationStrategy: LocationStrategy);
    baseHref(href?: string): string;
}
