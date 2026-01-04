import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { memoryLocationPlugin, UIRouter, StateService } from '@uirouter/core';
import { UIRouterModule } from '../../src';

@Component({ selector: 'home', template: '<h1>APP</h1><ui-view></ui-view>', standalone: false })
export class AppComponent {}

describe('onBefore hook', () => {
  let stateService;
  const hookSpy = vi.fn(trans => (stateService = trans.injector().get(StateService)));

  const setupTests = () => {
    const configFn = (router: UIRouter) => {
      router.plugin(memoryLocationPlugin);
      router.transitionService.onBefore({}, hookSpy);
    };

    const routerModule = UIRouterModule.forRoot({
      useHash: true,
      states: [{ name: 'home', url: '/home' }],
      initial: '/home',
      config: configFn,
    });

    TestBed.configureTestingModule({
      imports: [routerModule],
      declarations: [AppComponent],
    });
  };

  beforeEach(setupTests);

  it('should be able to inject StateService', () => {
    TestBed.createComponent(AppComponent);
    expect(hookSpy).toHaveBeenCalledTimes(1);
    expect(stateService).toBeDefined();
    expect(stateService instanceof StateService).toBeTruthy();
  });
});
