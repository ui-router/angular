import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home.component";
import { AboutComponent } from "./about.component";
import { UIRouter, UIRouterModule } from "@uirouter/angular";
import { BrowserModule } from "@angular/platform-browser";

const states = [
  { name: 'home', url: '/home', component: HomeComponent },
  { name: 'about', url: '/about', component: AboutComponent },
  { name: 'lazy.**', url: '/lazy', loadChildren: () => import('./lazy/lazy.module').then((m) => m.LazyModule) },
];

export function config(router: UIRouter) {
  router.urlService.rules.initial({ state: 'home' });
}

@NgModule({
  imports:[
    BrowserModule,
    UIRouterModule.forRoot({ states, config })
  ],
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent
  ]
})
export class AppModule {}
