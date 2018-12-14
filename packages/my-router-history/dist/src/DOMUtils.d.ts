export declare const canUseDOM: boolean;
export declare function getConfirmation(message: any, callback: any): void;
/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */
export declare function supportsHistory(): boolean;
/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */
export declare function supportsPopStateOnHashChange(): boolean;
/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */
export declare function supportsGoWithoutReloadUsingHash(): boolean;
/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */
export declare function isExtraneousPopstateEvent(event: any): void;
