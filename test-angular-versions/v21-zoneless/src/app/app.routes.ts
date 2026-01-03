import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';
import { UIRouter } from '@uirouter/angular';

export const states = [
  { name: 'home', url: '/home', component: HomeComponent },
  { name: 'about', url: '/about', component: AboutComponent },
  { name: 'lazy.**', url: '/lazy', loadChildren: () => import('./lazy/lazy.module').then((m) => m.LazyModule) },
];

export function config(router: UIRouter) {
  router.urlService.rules.initial({ state: 'home' });
}
