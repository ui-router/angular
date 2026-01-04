import '@analogjs/vitest-angular/setup-testbed';
import { afterEach } from 'vitest';

import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

// Global cleanup after each test to ensure test isolation
afterEach(() => {
  TestBed.resetTestingModule();
});

// Shared browser mocks for jsdom
import '../test/browser-mocks';
