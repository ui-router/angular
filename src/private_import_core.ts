/** @module ng2 */
/**
 * @Kamshak It's imported like this in @angular/compiler as well.
 * https://github.com/angular/angular/blob/e951612af2ea4bfe03cd1957decb316f507900fe/packages/compiler/src/ng_module_resolver.ts
 */

import { ɵreflector as r, ɵReflectorReader as rr} from '@angular/core';
export type ReflectorReader = typeof rr;
export const reflector: typeof r = r;