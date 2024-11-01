import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideUIRouter } from '@uirouter/angular';
import { states, config } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideUIRouter({ states: states, config: config })
  ]
};
