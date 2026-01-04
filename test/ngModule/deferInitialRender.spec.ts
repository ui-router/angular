import { inject, TestBed } from '@angular/core/testing';
import { UIRouterModule } from '../../src/uiRouterNgModule';
import { memoryLocationPlugin, UIRouter } from '@uirouter/core';
import { APP_INITIALIZER, ApplicationInitStatus, Component } from '@angular/core';
import { Ng2StateDeclaration } from '../../src/interface';
import { describe, beforeEach, it, expect } from 'vitest';

const timeout = (delay?: number) => new Promise((resolve) => setTimeout(resolve, delay));
const configFn = (router: UIRouter) => router.plugin(memoryLocationPlugin);

@Component({ selector: 'home', template: 'HOME', standalone: false })
export class HomeComponent {}

@Component({ selector: 'home', template: '<h1>APP</h1><ui-view></ui-view>', standalone: false })
export class AppComponent {}

const setupTests = (deferInitialRender: boolean) => {
  let resolveData, resolveAppInitializer;
  const promise = new Promise<any>((_resolve) => (resolveData = _resolve));
  const appInitializer = new Promise<any>((_resolve) => (resolveAppInitializer = _resolve));

  const homeState: Ng2StateDeclaration = {
    name: 'home',
    component: HomeComponent,
    url: '/home',
    resolve: [{ token: 'data', resolveFn: () => promise }],
  };

  const routerModule = UIRouterModule.forRoot({
    useHash: true,
    states: [homeState],
    deferInitialRender: deferInitialRender,
    config: configFn,
  });

  TestBed.configureTestingModule({
    declarations: [HomeComponent, AppComponent],
    imports: [routerModule],
    providers: [{ provide: APP_INITIALIZER, useValue: () => appInitializer, multi: true }],
  });

  return { resolveData, resolveAppInitializer };
};

describe('deferInitialRender == false', () => {
  let resolveData, resolveAppInitializer, router: UIRouter, status: ApplicationInitStatus;
  beforeEach(() => {
    const resolves = setupTests(false);
    resolveData = resolves.resolveData;
    resolveAppInitializer = resolves.resolveAppInitializer;
  });

  beforeEach(inject([UIRouter, ApplicationInitStatus], (_router, _status) => {
    router = _router;
    status = _status;
  }));

  it('should not wait for initial transition', async () => {
    const { stateService } = router;
    const fixture = TestBed.createComponent(AppComponent);

    expect(status.done).toBe(false);
    resolveAppInitializer();
    const goPromise = stateService.go('home');

    fixture.detectChanges();
    await fixture.whenStable();
    expect(status.done).toBe(true);

    resolveData();
    await goPromise;
  });
});

describe('deferInitialRender == true', () => {
  let resolveData, resolveAppInitializer, router: UIRouter, status: ApplicationInitStatus;
  beforeEach(() => {
    const resolves = setupTests(true);
    resolveData = resolves.resolveData;
    resolveAppInitializer = resolves.resolveAppInitializer;
  });

  beforeEach(inject([UIRouter, ApplicationInitStatus], (_router, _status) => {
    router = _router;
    status = _status;
  }));

  it('should wait for initial transition', async () => {
    const { stateService } = router;
    const fixture = TestBed.createComponent(AppComponent);

    // Before app initializer resolves, status should not be done
    expect(status.done).toBe(false);

    resolveAppInitializer();

    // Start a transition to 'home' - this has a resolve that returns a promise
    const goPromise = stateService.go('home');

    fixture.detectChanges();
    await fixture.whenStable();

    // Key assertion: with deferInitialRender=true, the application should NOT
    // be marked as done until the initial transition completes.
    // The resolve data is still pending at this point.
    expect(status.done).toBe(false);

    // Wait, then resolve the data that the 'home' state is waiting for
    await timeout();
    resolveData();

    // Wait for the transition to complete
    await goPromise;
    await timeout();
    await fixture.whenStable();

    // After everything settles, status.done should be true
    expect(status.done).toBe(true);
  });
});
