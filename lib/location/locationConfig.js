/** @module ng2 */
/** */
import * as tslib_1 from "tslib";
import { is, BrowserLocationConfig } from "@uirouter/core";
import { PathLocationStrategy } from "@angular/common";
var Ng2LocationConfig = (function (_super) {
    tslib_1.__extends(Ng2LocationConfig, _super);
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