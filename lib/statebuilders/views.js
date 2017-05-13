import { pick, forEach } from "@uirouter/core";
import { services } from "@uirouter/core";
import { ViewService } from "@uirouter/core";
/**
 * This is a [[StateBuilder.builder]] function for Angular `views`.
 *
 * When the [[StateBuilder]] builds a [[State]] object from a raw [[StateDeclaration]], this builder
 * handles the `views` property with logic specific to @uirouter/angular.
 *
 * If no `views: {}` property exists on the [[StateDeclaration]], then it creates the `views` object and
 * applies the state-level configuration to a view named `$default`.
 */
export function ng2ViewsBuilder(state) {
    var views = {}, viewsObject = state.views || { "$default": pick(state, ["component", "bindings"]) };
    forEach(viewsObject, function (config, name) {
        name = name || "$default"; // Account for views: { "": { template... } }
        if (Object.keys(config).length == 0)
            return;
        config.$type = "ng2";
        config.$context = state;
        config.$name = name;
        var normalized = ViewService.normalizeUIViewTarget(config.$context, config.$name);
        config.$uiViewName = normalized.uiViewName;
        config.$uiViewContextAnchor = normalized.uiViewContextAnchor;
        views[name] = config;
    });
    return views;
}
var id = 0;
var Ng2ViewConfig = (function () {
    function Ng2ViewConfig(path, viewDecl) {
        this.path = path;
        this.viewDecl = viewDecl;
        this.$id = id++;
        this.loaded = true;
    }
    Ng2ViewConfig.prototype.load = function () {
        return services.$q.when(this);
    };
    return Ng2ViewConfig;
}());
export { Ng2ViewConfig };
//# sourceMappingURL=views.js.map