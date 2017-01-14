/** @module ng2 */
/** */

import { UIRouter, is, isDefined } from "ui-router-core";
import { PlatformLocation, LocationStrategy, PathLocationStrategy } from "@angular/common";

export class Ng2LocationConfig {
  private _isHtml5: boolean;
  private _hashPrefix: string = "";

  constructor(router: UIRouter, locationStrategy: LocationStrategy, public platformLocation: PlatformLocation) {
    this._isHtml5 = is(PathLocationStrategy)(locationStrategy);
  }

  dispose() {}
  port = () => null as number;
  protocol = () => null as string;
  host = () => null as string;
  baseHref = () => this.platformLocation.getBaseHrefFromDOM();
  html5Mode = () => this._isHtml5;
  hashPrefix = (newprefix?: string): string => {
    if(isDefined(newprefix)) {
      this._hashPrefix = newprefix;
    }
    return this._hashPrefix;
  };
}