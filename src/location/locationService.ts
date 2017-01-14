/** @module ng2 */
/** */
import { UIRouter } from "ui-router-core";
import { BaseLocationServices } from "ui-router-core/lib/vanilla";
import { parseUrl } from "ui-router-core/lib/vanilla/utils";
import { PlatformLocation, LocationStrategy } from "@angular/common";

/** A `LocationServices` that uses the browser hash "#" to get/set the current location */
export class Ng2LocationServices extends BaseLocationServices {
  constructor(router: UIRouter, private _locationStrategy: LocationStrategy, private _platform: PlatformLocation) {
    super(router, true);
    this._locationStrategy.onPopState(this._listener)
  }

  _get() {
    return this._locationStrategy.path(true);
  }

  _set(state: any, title: string, url: string, replace: boolean): any {
    let { path, search, hash } = parseUrl(url);
    let urlWithHash = path + (hash ? "#" + hash : "");

    if (replace) {
      this._locationStrategy.replaceState(state, title, urlWithHash, search);
    } else {
      this._locationStrategy.pushState(state, title, urlWithHash, search);
    }
  }

  dispose(router: UIRouter) {
    super.dispose(router);
  }
}
