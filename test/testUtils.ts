import { DebugElement } from '@angular/core';
export function clickOnElement(element: DebugElement, button = 0, metaKey = false, ctrlKey = false) {
  element.triggerEventHandler('click', { button, metaKey, ctrlKey });
}
