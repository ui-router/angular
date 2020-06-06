import { UISref, AnchorUISref } from './uiSref';
import { UISrefActive } from './uiSrefActive';
import { UIView } from './uiView';
import { UISrefStatus } from './uiSrefStatus';

export * from './uiView';
export * from './uiSref';
export * from './uiSrefStatus';
export * from './uiSrefActive';

/** @internal */
export const _UIROUTER_DIRECTIVES = [UISref, AnchorUISref, UIView, UISrefActive, UISrefStatus];

/**
 * References to the UI-Router directive classes, for use within a @Component's `directives:` property
 * @deprecated use [[UIRouterModule]]
 * @internal
 */
export const UIROUTER_DIRECTIVES = _UIROUTER_DIRECTIVES;
