var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/** @module ng2 */
/** */
import { BaseLocationServices, parseUrl } from '@uirouter/core';
/** A `LocationServices` that delegates to the Angular LocationStrategy */
var Ng2LocationServices = (function (_super) {
    __extends(Ng2LocationServices, _super);
    function Ng2LocationServices(router, _locationStrategy) {
        var _this = _super.call(this, router, true) || this;
        _this._locationStrategy = _locationStrategy;
        _this._locationStrategy.onPopState(function (evt) {
            if (evt.type !== 'hashchange') {
                _this._listener(evt);
            }
        });
        return _this;
    }
    Ng2LocationServices.prototype._get = function () {
        return this._locationStrategy.path(true)
            .replace(this._locationStrategy.getBaseHref().replace(/\/$/, ''), '');
    };
    Ng2LocationServices.prototype._set = function (state, title, url, replace) {
        var _a = parseUrl(url), path = _a.path, search = _a.search, hash = _a.hash;
        var urlWithHash = path + (hash ? "#" + hash : "");
        if (replace) {
            this._locationStrategy.replaceState(state, title, urlWithHash, search);
        }
        else {
            this._locationStrategy.pushState(state, title, urlWithHash, search);
        }
    };
    Ng2LocationServices.prototype.dispose = function (router) {
        _super.prototype.dispose.call(this, router);
    };
    return Ng2LocationServices;
}(BaseLocationServices));
export { Ng2LocationServices };
//# sourceMappingURL=locationService.js.map