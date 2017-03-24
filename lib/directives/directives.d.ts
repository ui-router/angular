/**
 * The UI-Router for Angular directives:
 *
 * - [[UIView]]: A viewport for routed components
 * - [[UISref]]: A state ref to a target state; navigates when clicked
 * - [[UISrefActive]]: (and `UISrefActiveEq`) Adds a css class when a UISref's target state (or a child state) is active
 *
 * @ng2api
 * @preferred
 * @module directives
 */ /** */
import { UISref, AnchorUISref } from "./uiSref";
import { UISrefActive } from "./uiSrefActive";
import { UIView } from "./uiView";
import { UISrefStatus } from "./uiSrefStatus";
export * from "./uiView";
export * from "./uiSref";
export * from "./uiSrefStatus";
export * from "./uiSrefActive";
/** @internalapi */
export declare const _UIROUTER_DIRECTIVES: (typeof UIView | typeof AnchorUISref | typeof UISref | typeof UISrefStatus | typeof UISrefActive)[];
/**
 * References to the UI-Router directive classes, for use within a @Component's `directives:` property
 * @deprecated use [[UIRouterModule]]
 * @internalapi
 */
export declare const UIROUTER_DIRECTIVES: (typeof UIView | typeof AnchorUISref | typeof UISref | typeof UISrefStatus | typeof UISrefActive)[];
