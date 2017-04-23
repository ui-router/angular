/** @module ng2 */
/** */
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
import { is, BrowserLocationConfig } from "@uirouter/core";
import { PathLocationStrategy } from "@angular/common";
var Ng2LocationConfig = (function (_super) {
    __extends(Ng2LocationConfig, _super);
    function Ng2LocationConfig(router, _locationStrategy) {
        var _this = _super.call(this, router, is(PathLocationStrategy)(_locationStrategy)) || this;
        _this._locationStrategy = _locationStrategy;
        return _this;
    }
    Ng2LocationConfig.prototype.baseHref = function (href) {
        return this._locationStrategy.getBaseHref();
    };
    return Ng2LocationConfig;
}(BrowserLocationConfig));
export { Ng2LocationConfig };
//# sourceMappingURL=locationConfig.js.map