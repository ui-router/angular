import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';
import { provideZoneChangeDetection } from '@angular/core';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed({
  zoneless: false,
  providers: [provideZoneChangeDetection()],
});

// Shared browser mocks for jsdom
import './browser-mocks';
