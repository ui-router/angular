import { UIRouterModule } from '../../../src/uiRouterNgModule';
import { Component, NgModule } from '@angular/core';

@Component({ selector: 'foo', template: 'FOO' })
export class FooComponent { }

@Component({ selector: 'child1', template: 'CHILD1' })
export class Child1Component { }

@Component({ selector: 'child2', template: 'CHILD2' })
export class Child2Component { }


export const foo = { name: 'foo', url: '/foo', component: FooComponent };
export const child1 = { name: 'foo.child1', url: '/child1', component: Child1Component };
export const child2 = { name: 'foo.child2', url: '/child2', component: Child2Component };

@NgModule({
  declarations: [FooComponent, Child1Component, Child2Component],
  imports: [UIRouterModule.forChild({ states: [ foo, child1, child2 ]})],
})
export class FooModule {}

@NgModule({
  declarations: [FooComponent, Child1Component, Child2Component],
  imports: [UIRouterModule.forChild({ states: [ child1, child2, foo ]})],
})
export class FooModuleOutOfOrder {}

