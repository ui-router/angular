import { DebugElement } from '@angular/core';

export function clickOnElement(element: DebugElement, button = 0, metaKey = false, ctrlKey = false) {
  element.triggerEventHandler('click', { button, metaKey, ctrlKey });
}

/**
 * Creates a macrotask tick to allow pending async operations to complete.
 *
 * Canonical async test pattern for UI Router Angular tests:
 *
 * ```typescript
 * it('should do something', async () => {
 *   // 1. Perform state transition
 *   await router.stateService.go('someState');
 *
 *   // 2. Allow macrotask queue to flush
 *   await tick();
 *
 *   // 3. Trigger change detection
 *   fixture.detectChanges();
 *
 *   // 4. (Optional) For dynamic property changes, mark for check first:
 *   //    fixture.changeDetectorRef.markForCheck();
 *   //    fixture.detectChanges();
 *   //    await fixture.whenStable();
 *
 *   // 5. Assert
 *   expect(...);
 * });
 * ```
 */
export const tick = () => new Promise((resolve) => setTimeout(resolve));

