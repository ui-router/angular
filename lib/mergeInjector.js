/**
 * Merge two injectors
 *
 * This class implements the Injector ng2 interface but delegates
 * to the Injectors provided in the constructor.
 */
var MergeInjector = (function () {
    function MergeInjector() {
        var injectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            injectors[_i] = arguments[_i];
        }
        if (injectors.length < 2)
            throw new Error("pass at least two injectors");
        this.injectors = injectors;
    }
    /**
     * Get the token from the first injector which contains it.
     *
     * Delegates to the first Injector.get().
     * If not found, then delegates to the second Injector (and so forth).
     * If no Injector contains the token, return the `notFoundValue`, or throw.
     *
     * @param token the DI token
     * @param notFoundValue the value to return if none of the Injectors contains the token.
     * @returns {any} the DI value
     */
    MergeInjector.prototype.get = function (token, notFoundValue) {
        for (var i = 0; i < this.injectors.length; i++) {
            var val = this.injectors[i].get(token, MergeInjector.NOT_FOUND);
            if (val !== MergeInjector.NOT_FOUND)
                return val;
        }
        if (arguments.length >= 2)
            return notFoundValue;
        // This will throw the DI Injector error
        this.injectors[0].get(token);
    };
    return MergeInjector;
}());
export { MergeInjector };
MergeInjector.NOT_FOUND = {};
//# sourceMappingURL=mergeInjector.js.map