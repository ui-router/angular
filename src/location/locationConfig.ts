/** @module ng2 */
/** */

import { UIRouter, is, BrowserLocationConfig } from "ui-router-core";
import { LocationStrategy, PathLocationStrategy } from "@angular/common";

export class Ng2LocationConfig extends BrowserLocationConfig {
  constructor(router: UIRouter, private _locationStrategy: LocationStrategy) {
    super(router, is(PathLocationStrategy)(_locationStrategy))
  }

  baseHref(href?: string): string {
    return this._locationStrategy.getBaseHref();
  }
}
