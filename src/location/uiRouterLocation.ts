/** @module ng2 */
/** */
import { PlatformLocation, LocationStrategy } from "@angular/common";
import { Injectable } from "@angular/core";
import { UIRouter } from "ui-router-core";
import { Ng2LocationConfig } from "./locationConfig";
import { Ng2LocationServices } from "./locationService";

@Injectable()
export class UIRouterLocation {
  constructor(public locationStrategy: LocationStrategy, public platformLocation: PlatformLocation ) { }

  init(router: UIRouter) {
    router.locationService = new Ng2LocationServices(router, this.locationStrategy, this.platformLocation);
    router.locationConfig = new Ng2LocationConfig(router, this.locationStrategy, this.platformLocation)
  }
}



