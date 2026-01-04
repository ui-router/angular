import { memoryLocationPlugin, UIRouter } from '@uirouter/core';
import { UIRouterModule } from '../../src/uiRouterNgModule';
import { TestBed } from '@angular/core/testing';
import { UIView } from '../../src/directives/uiView';
import { Ng2StateDeclaration } from '../../src/interface';
import { describe, beforeEach, it, expect } from 'vitest';

const fooState = {
  name: 'foo',
  url: '/foo',
  loadComponent: () => import('./foo/foo.component').then((result) => result.FooComponent),
};

const barState = {
  name: 'bar',
  url: '/bar',
  loadComponent: () => import('./bar/bar.component').then((result) => result.BarComponent),
};

function configFn(router: UIRouter) {
  router.plugin(memoryLocationPlugin);
}

describe('lazy loading', () => {
  beforeEach(() => {
    const routerModule = UIRouterModule.forRoot({ useHash: true, states: [], config: configFn });
    TestBed.configureTestingModule({
      declarations: [],
      imports: [routerModule],
    });
  });

  it('should lazy load a standalone component', async () => {
    const router = TestBed.inject(UIRouter);
    const { stateRegistry, stateService, globals } = router;

    stateRegistry.register(fooState);
    const fixture = TestBed.createComponent(UIView);
    fixture.detectChanges();
    const names = stateRegistry
      .get()
      .map((state) => state.name)
      .sort();
    expect(names.length).toBe(2);
    expect(names).toEqual(['', 'foo']);

    await stateService.go('foo');
    fixture.detectChanges();

    expect(globals.current.name).toBe('foo');
    expect((globals.current as Ng2StateDeclaration).component).toBeTruthy();
    const innerText = fixture.debugElement.nativeElement.textContent.replace(/\s+/g, ' ').trim();
    expect(innerText).toBe('FOO');
  });

  it('should throw error if component is not standalone', async () => {
    const router = TestBed.inject(UIRouter);
    const { stateRegistry, stateService } = router;

    // Suppress default error handler to avoid stderr noise for expected errors
    stateService.defaultErrorHandler(() => {});

    stateRegistry.register(barState);
    const fixture = TestBed.createComponent(UIView);
    fixture.detectChanges();
    const names = stateRegistry
      .get()
      .map((state) => state.name)
      .sort();
    expect(names.length).toBe(2);
    expect(names).toEqual(['', 'bar']);

    try {
      await stateService.go('bar');
      throw new Error('success not expected');
    } catch (err) {
      expect(err).toHaveProperty('detail.message', 'Is not a standalone component.');
    }
  });
});
