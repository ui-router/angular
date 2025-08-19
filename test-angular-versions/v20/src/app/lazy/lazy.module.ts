import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIRouterModule } from '@uirouter/angular';
import { LazyComponent } from './lazy.component';

export const states = [
  { name: 'lazy', url: '/lazy', component: LazyComponent },
  { name: 'lazy.child', url: '/child', component: LazyComponent },
  {
    name: 'lazy.child.viewtarget',
    url: '/viewtarget',
    views: {
      '!header': { component: LazyComponent },
      'footer@': { component: LazyComponent },
    },
  },
];

@NgModule({
  imports: [CommonModule, UIRouterModule.forChild({ states: states })],
  declarations: [LazyComponent],
})
export class LazyModule {}
