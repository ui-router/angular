import { forEach, map, omit, pick } from '@uirouter/core';
import { DebugElement } from '@angular/core';
const stateProps = ['resolve', 'resolvePolicy', 'data', 'template', 'templateUrl', 'url', 'name', 'params'];

export function tree2Array(tree, inheritName) {

  function processState(parent, state, name) {
    const substates = omit.apply(null, [state].concat(stateProps));
    const thisState = pick.apply(null, [state].concat(stateProps));
    thisState.name = name;
    if (!inheritName) thisState.parent = parent;

    return [thisState].concat(processChildren(thisState, substates));
  }

  function processChildren(parent, substates) {
    let states = [];
    forEach(substates, function (value, key) {
      if (inheritName && parent.name) key = `${parent.name}.${key}`;
      states = states.concat(processState(parent, value, key));
    });
    return states;
  }

  return processChildren('', tree);
}

export function clickOnElement(element: DebugElement, button = 0, metaKey = false, ctrlKey = false) {
  element.triggerEventHandler('click', { button, metaKey, ctrlKey });
}
