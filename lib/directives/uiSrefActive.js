var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/** @ng2api @module directives */ /** */
import { Directive, Input, ElementRef, Host, Renderer } from "@angular/core";
import { UISrefStatus } from "./uiSrefStatus";
/**
 * A directive that adds a CSS class when its associated `uiSref` link is active.
 *
 * ### Purpose
 *
 * This directive should be paired with one (or more) [[UISref]] directives.
 * It will apply a CSS class to its element when the state the `uiSref` targets is activated.
 *
 * This can be used to create navigation UI where the active link is highlighted.
 *
 * ### Selectors
 *
 * - `[uiSrefActive]`: When this selector is used, the class is added when the target state or any
 * child of the target state is active
 * - `[uiSrefActiveEq]`: When this selector is used, the class is added when the target state is
 * exactly active (the class is not added if a child of the target state is active).
 *
 * ### Inputs
 *
 * - `uiSrefActive`/`uiSrefActiveEq`: one or more CSS classes to add to the element, when the `uiSref` is active
 *
 * #### Example:
 * The anchor tag has the `active` class added when the `foo` state is active.
 * ```html
 * <a uiSref="foo" uiSrefActive="active">Foo</a>
 * ```
 *
 * ### Matching parameters
 *
 * If the `uiSref` includes parameters, the current state must be active, *and* the parameter values must match.
 *
 * #### Example:
 * The first anchor tag has the `active` class added when the `foo.bar` state is active and the `id` parameter
 * equals 25.
 * The second anchor tag has the `active` class added when the `foo.bar` state is active and the `id` parameter
 * equals 32.
 * ```html
 * <a uiSref="foo.bar" [uiParams]="{ id: 25 }" uiSrefActive="active">Bar #25</a>
 * <a uiSref="foo.bar" [uiParams]="{ id: 32 }" uiSrefActive="active">Bar #32</a>
 * ```
 *
 * #### Example:
 * A list of anchor tags are created for a list of `bar` objects.
 * An anchor tag will have the `active` class when `foo.bar` state is active and the `id` parameter matches
 * that object's `id`.
 * ```html
 * <li *ngFor="let bar of bars">
 *   <a uiSref="foo.bar" [uiParams]="{ id: bar.id }" uiSrefActive="active">Bar #{{ bar.id }}</a>
 * </li>
 * ```
 *
 * ### Multiple uiSrefs
 *
 * A single `uiSrefActive` can be used for multiple `uiSref` links.
 * This can be used to create (for example) a drop down navigation menu, where the menui is highlighted
 * if *any* of its inner links are active.
 *
 * The `uiSrefActive` should be placed on an ancestor element of the `uiSref` list.
 * If anyof the `uiSref` links are activated, the class will be added to the ancestor element.
 *
 * #### Example:
 * This is a dropdown nagivation menu for "Admin" states.
 * When any of `admin.users`, `admin.groups`, `admin.settings` are active, the `<li>` for the dropdown
 * has the `dropdown-child-active` class applied.
 * Additionally, the active anchor tag has the `active` class applied.
 * ```html
 * <ul class="dropdown-menu">
 *   <li uiSrefActive="dropdown-child-active" class="dropdown admin">
 *     Admin
 *     <ul>
 *       <li><a uiSref="admin.users" uiSrefActive="active">Users</a></li>
 *       <li><a uiSref="admin.groups" uiSrefActive="active">Groups</a></li>
 *       <li><a uiSref="admin.settings" uiSrefActive="active">Settings</a></li>
 *     </ul>
 *   </li>
 * </ul>
 * ```
 */
var UISrefActive = (function () {
    function UISrefActive(uiSrefStatus, rnd, host) {
        var _this = this;
        this._classes = [];
        this._classesEq = [];
        this._subscription = uiSrefStatus.uiSrefStatus.subscribe(function (next) {
            _this._classes.forEach(function (cls) { return rnd.setElementClass(host.nativeElement, cls, next.active); });
            _this._classesEq.forEach(function (cls) { return rnd.setElementClass(host.nativeElement, cls, next.exact); });
        });
    }
    Object.defineProperty(UISrefActive.prototype, "active", {
        set: function (val) { this._classes = val.split("\s+"); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(UISrefActive.prototype, "activeEq", {
        set: function (val) { this._classesEq = val.split("\s+"); },
        enumerable: true,
        configurable: true
    });
    ;
    UISrefActive.prototype.ngOnDestroy = function () {
        this._subscription.unsubscribe();
    };
    return UISrefActive;
}());
__decorate([
    Input('uiSrefActive'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], UISrefActive.prototype, "active", null);
__decorate([
    Input('uiSrefActiveEq'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], UISrefActive.prototype, "activeEq", null);
UISrefActive = __decorate([
    Directive({
        selector: '[uiSrefActive],[uiSrefActiveEq]'
    }),
    __param(2, Host()),
    __metadata("design:paramtypes", [UISrefStatus, Renderer, ElementRef])
], UISrefActive);
export { UISrefActive };
//# sourceMappingURL=uiSrefActive.js.map