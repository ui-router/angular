import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIRouterModule } from '@uirouter/angular';
import { LazyComponent } from './lazy.component';

export const states = [
  { name: 'lazy', url: '/lazy', component: LazyComponent },
  {
    name: 'lazy.child',
    url: '/child',
    loadComponent: () => import("./lazy2.component").then(m => m.Lazy2Component)
  },
  {
    name: 'lazy.child.viewtarget',
    url: '/viewtarget',
    views: {
      '!header': { component: LazyComponent },
      'footer@': { component: LazyComponent },
    },
  },
];

export const LAZY_PROVIDER_TOKE = new InjectionToken<string>("lazyProvider");

@NgModule({
  imports: [CommonModule, UIRouterModule.forChild({ states: states })],
  providers: [
    {
      provide: LAZY_PROVIDER_TOKE,
      useValue: "provided value"
    }
  ],
  declarations: [LazyComponent],
})
export class LazyModule {}
