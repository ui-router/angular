/** @module ng2 */
/** */
import { BaseLocationServices, UIRouter } from '@uirouter/core';
import { LocationStrategy } from '@angular/common';
/** A `LocationServices` that delegates to the Angular LocationStrategy */
export declare class Ng2LocationServices extends BaseLocationServices {
    private _locationStrategy;
    constructor(router: UIRouter, _locationStrategy: LocationStrategy, isBrowser: boolean);
    _get(): string;
    _set(state: any, title: string, url: string, replace: boolean): any;
    dispose(router: UIRouter): void;
}
