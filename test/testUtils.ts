import { forEach, map, omit, pick } from 'ui-router-core';
import { TestBed } from '@angular/core/testing';
let stateProps = ["resolve", "resolvePolicy", "data", "template", "templateUrl", "url", "name", "params"];

export function tree2Array(tree, inheritName) {

  function processState(parent, state, name) {
    let substates = omit.apply(null, [state].concat(stateProps));
    let thisState = pick.apply(null, [state].concat(stateProps));
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

  return processChildren("", tree);
}

export function PromiseResult(promise?) {
  let self = this, _promise: Promise<any>;
  let resolve, reject, complete;

  this.setPromise = function(promise) {
    if (_promise) {
      throw new Error("Already have with'd a promise.");
    }

    let onfulfilled = (data) =>
        resolve = data || true;
    let onrejected = (err) =>
        reject = err || true;
    let done = () =>
        complete = true;

    _promise = promise;
    _promise.then(onfulfilled)
        .catch(onrejected)
        .then(done, done);
  };

  this.get = () =>
      ({ resolve: resolve, reject: reject, complete: complete });

  this.called = () =>
      map(self.get(), (val, key) => val !== undefined);

  if (promise) {
    this.setPromise(promise);
  }
}


