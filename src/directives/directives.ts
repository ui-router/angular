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
import {UISref, AnchorUISref} from "./uiSref";
import {UISrefActive} from "./uiSrefActive";
import {UIView} from "./uiView";
import {UISrefStatus} from "./uiSrefStatus";

export * from "./uiView";
export * from "./uiSref";
export * from "./uiSrefStatus";
export * from "./uiSrefActive";

/** @internalapi */
export const _UIROUTER_DIRECTIVES = [UISref, AnchorUISref, UIView, UISrefActive, UISrefStatus];

/**
 * References to the UI-Router directive classes, for use within a @Component's `directives:` property
 * @deprecated use [[UIRouterModule]]
 * @internalapi
 */
export const UIROUTER_DIRECTIVES = _UIROUTER_DIRECTIVES;
