import { BaseLocationServices, parseUrl, UIRouter } from '@uirouter/core';
import { LocationStrategy } from '@angular/common';

/** A `LocationServices` that delegates to the Angular LocationStrategy */
export class Ng2LocationServices extends BaseLocationServices {
  constructor(router: UIRouter, private _locationStrategy: LocationStrategy, isBrowser: boolean) {
    super(router, isBrowser);

    this._locationStrategy.onPopState((evt) => {
      if (evt.type !== 'hashchange') {
        this._listener(evt);
      }
    });
  }

  _get() {
    return this._locationStrategy.path(true).replace(this._locationStrategy.getBaseHref().replace(/\/$/, ''), '');
  }

  _set(state: any, title: string, url: string, replace: boolean): any {
    const { path, search, hash } = parseUrl(url);

    const hashWithPrefix = hash ? '#' + hash : '';
    let urlPath = path;
    let urlParams = search;

    if (search) {
      urlParams += hashWithPrefix;
    } else {
      urlPath += hashWithPrefix;
    }

    if (replace) {
      this._locationStrategy.replaceState(state, title, urlPath, urlParams);
    } else {
      this._locationStrategy.pushState(state, title, urlPath, urlParams);
    }
  }

  dispose(router: UIRouter) {
    super.dispose(router);
  }
}
