import { async, inject, TestBed } from '@angular/core/testing';
import { UIRouterModule } from '../../src/uiRouterNgModule';
import { UIView } from '../../src/directives/uiView';
import { memoryLocationPlugin, UIRouter } from '@uirouter/core';
import {
  ApplicationInitStatus,
  Component,
  NgModule,
  NgModuleFactoryLoader,
  SystemJsNgModuleLoader,
} from '@angular/core';
import { Ng2StateDeclaration } from '../../src/interface';

const timeout = (delay?: number) => new Promise(resolve => setTimeout(resolve, delay));
const configFn = (router: UIRouter) => router.plugin(memoryLocationPlugin);

@Component({ selector: 'home', template: 'HOME' })
export class HomeComponent {}

@Component({ selector: 'home', template: '<h1>APP</h1><ui-view></ui-view>' })
export class AppComponent {}

const setupTests = (deferInitialRender: boolean) => {
  let resolve;
  const promise = new Promise<any>(_resolve => (resolve = _resolve));

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
    providers: [{ provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader }],
  });

  return resolve;
};

describe('deferInitialRender == false', () => {
  let resolve, router: UIRouter, status: ApplicationInitStatus;
  beforeEach(() => {
    resolve = setupTests(false);
  });

  beforeEach(
    inject([UIRouter, ApplicationInitStatus], (_router, _status) => {
      router = _router;
      status = _status;
    })
  );

  it('should not wait for initial transition', async done => {
    const { stateService } = router;
    const fixture = TestBed.createComponent(AppComponent);

    expect(status.done).toBe(false);
    const goPromise = stateService.go('home');

    fixture.detectChanges();
    await fixture.whenStable();
    expect(status.done).toBe(false);

    await timeout();
    expect(status.done).toBe(true);

    resolve();
    await goPromise;
    done();
  });
});

describe('deferInitialRender == true', () => {
  let resolve, router: UIRouter, status: ApplicationInitStatus;
  beforeEach(() => {
    resolve = setupTests(true);
  });

  beforeEach(
    inject([UIRouter, ApplicationInitStatus], (_router, _status) => {
      router = _router;
      status = _status;
    })
  );

  it('should wait for initial transition', async done => {
    const { stateService } = router;
    const fixture = TestBed.createComponent(AppComponent);

    expect(status.done).toBe(false);
    const goPromise = stateService.go('home');

    fixture.detectChanges();
    await fixture.whenStable();
    expect(status.done).toBe(false);

    await timeout();
    resolve();

    await goPromise;
    expect(status.done).toBe(false);

    await timeout();
    expect(status.done).toBe(true);

    done();
  });
});
