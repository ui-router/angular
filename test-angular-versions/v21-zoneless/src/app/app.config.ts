import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideUIRouter } from '@uirouter/angular';
import { states, config } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideUIRouter({ states: states, config: config })
  ]
};
