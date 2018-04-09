/** @module ng2 */ /** */
import { isFunction, StateObject } from '@uirouter/core';
import { PathNode } from '@uirouter/core';
import { pick, forEach } from '@uirouter/core';
import { ViewConfig } from '@uirouter/core';
import { Ng2ViewDeclaration } from '../interface';
import { services } from '@uirouter/core';
import { ViewService } from '@uirouter/core';

/**
 * This is a [[StateBuilder.builder]] function for Angular `views`.
 *
 * When the [[StateBuilder]] builds a [[State]] object from a raw [[StateDeclaration]], this builder
 * handles the `views` property with logic specific to @uirouter/angular.
 *
 * If no `views: {}` property exists on the [[StateDeclaration]], then it creates the `views` object and
 * applies the state-level configuration to a view named `$default`.
 */
export function ng2ViewsBuilder(state: StateObject) {
  const views: { [key: string]: Ng2ViewDeclaration } = {},
    viewsObject = state.views || { $default: pick(state, ['component', 'bindings']) };

  forEach(viewsObject, function(config: Ng2ViewDeclaration, name: string) {
    name = name || '$default'; // Account for views: { "": { template... } }
    if (isFunction(config)) config = { component: config as any };
    if (Object.keys(config).length === 0) return;

    config.$type = 'ng2';
    config.$context = state;
    config.$name = name;

    const normalized = ViewService.normalizeUIViewTarget(config.$context, config.$name);
    config.$uiViewName = normalized.uiViewName;
    config.$uiViewContextAnchor = normalized.uiViewContextAnchor;

    views[name] = config;
  });
  return views;
}

let id = 0;
export class Ng2ViewConfig implements ViewConfig {
  $id: number = id++;
  loaded = true;

  constructor(public path: PathNode[], public viewDecl: Ng2ViewDeclaration) {}

  load() {
    return services.$q.when(this);
  }
}
