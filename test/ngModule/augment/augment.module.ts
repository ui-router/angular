import { StatesModule, UIRouterModule } from '../../../src/uiRouterNgModule';
import { Component, Injector, NgModule } from '@angular/core';
import { UIRouter } from '@uirouter/core';
import { Ng2StateDeclaration } from '../../../src/interface';

@Component({
  selector: 'component1',
  template: '<h1>Component 1</h1><ui-view></ui-view>'
}) export class Component1 { }

@Component({
  selector: 'component2',
  template: '<h1>Component 2</h1>',
}) export class Component2 { }


export const augment1 = { name: 'augment1', component: Component1 };
export const augment2 = { name: 'augment1.augment2', component: Component2 };
export const states: Ng2StateDeclaration[] = [augment1, augment2];

export function config(router: UIRouter, injector: Injector, module: StatesModule) {
  const registry = router.stateRegistry;

  // copy urls from old state to new
  states.forEach(state => state.url = registry.get(state.name).url);
  registry.deregister('augment1');
  module.states = states;
}

@NgModule({
  imports: [UIRouterModule.forChild({ config })],
  declarations: [Component1, Component2],
  entryComponents: [Component1, Component2],
})
export class AugmentModule {}
