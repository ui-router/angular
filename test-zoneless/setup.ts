import '@analogjs/vitest-angular/setup-testbed';
import { afterEach } from 'vitest';

import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

// Global cleanup after each test to ensure test isolation
afterEach(() => {
  TestBed.resetTestingModule();
});

// Shared browser mocks for jsdom
import '../test/browser-mocks';
