import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';
import { UIRouterModule } from '@uirouter/angular';
import { UIRouter } from '@uirouter/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';

export const states = [
  { name: 'home', url: '/home', component: HomeComponent },
  { name: 'about', url: '/about', component: AboutComponent },
  { name: 'lazy.**', url: '/lazy', loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule) },
];

export function config(router: UIRouter) {
  router.urlService.rules.initial({ state: 'home' });
}

@NgModule({
  imports: [BrowserModule, UIRouterModule.forRoot({ states, config })],
  providers: [{ provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader }],
  declarations: [AppComponent, HomeComponent, AboutComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
