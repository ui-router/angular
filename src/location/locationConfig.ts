/** @module ng2 */
/** */

import { UIRouter, is, isDefined } from "ui-router-core";
import { LocationStrategy, PathLocationStrategy } from "@angular/common";

export class Ng2LocationConfig {
  private _isHtml5: boolean;
  private _hashPrefix: string = "";

  constructor(router: UIRouter, private _locationStrategy: LocationStrategy) {
    this._isHtml5 = is(PathLocationStrategy)(_locationStrategy);
  }

  dispose() {}
  port = () => null as number;
  protocol = () => null as string;
  host = () => null as string;
  baseHref = () => this._locationStrategy.getBaseHref();
  html5Mode = () => this._isHtml5;
  hashPrefix = (newprefix?: string): string => {
    if (isDefined(newprefix)) {
      this._hashPrefix = newprefix;
    }
    return this._hashPrefix;
  };
}