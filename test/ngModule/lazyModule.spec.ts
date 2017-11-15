import { async, inject, TestBed } from '@angular/core/testing';
import { UIRouterModule } from '../../src/uiRouterNgModule';
import { UIView } from '../../src/directives/uiView';
import { memoryLocationPlugin, UIRouter } from '@uirouter/core';
import { NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';

declare let System;

let futureFoo = {
  name: 'foo.**',
  url: '/foo',
  loadChildren: () => System.import('./foo/foo.module').then(x => x.FooModule)
};

let futureBar = {
  name: 'bar.**',
  url: '/bar',
  loadChildren: () => System.import('./foo/foo.module').then(x => x.FooModule)
};

let augment1 = {
  name: 'augment1',
  url: '/augment1',
  loadChildren: () => System.import('./augment/augment.module').then(x => x.AugmentModule)
};

let augment2 = {
  name: 'augment1.augment2',
  url: '/augment2',
};

function configFn(router: UIRouter) {
  router.plugin(memoryLocationPlugin);
}

describe('lazy loading', () => {
  beforeEach(() => {
    let routerModule = UIRouterModule.forRoot({ useHash: true, states: [], config: configFn });

    TestBed.configureTestingModule({
      declarations: [],
      imports: [routerModule],
      providers: [
        { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
      ]
    });
  });

  it('should lazy load a module', async(inject([UIRouter], (router: UIRouter) => {
    let { stateRegistry, stateService, globals } = router;
    stateRegistry.register(futureFoo);

    const fixture = TestBed.createComponent(UIView);
    fixture.detectChanges();


    let names = stateRegistry.get().map(state => state.name).sort();
    expect(names.length).toBe(2);
    expect(names).toEqual(['', 'foo.**']);

    stateService.go('foo').then(() => {
      expect(globals.current.name).toBe('foo');

      names = stateRegistry.get().map(state => state.name).sort();
      expect(names.length).toBe(4);
      expect(names).toEqual(['', 'foo', 'foo.child1', 'foo.child2']);
    });
  })));

  it('should throw if no future state replacement is lazy loaded', async(inject([UIRouter], (router: UIRouter) => {
    let { stateRegistry, stateService } = router;
    stateService.defaultErrorHandler(() => null);
    stateRegistry.register(futureBar);

    const fixture = TestBed.createComponent(UIView);
    fixture.detectChanges();

    let names = stateRegistry.get().map(state => state.name).sort();
    expect(names.length).toBe(2);
    expect(names).toEqual(['', 'bar.**']);

    const success = () => { throw Error('success not expected') };
    const error = (err) => {
      expect(err.detail.message).toContain("The lazy loaded NgModule must have a state named 'bar'"); };
    stateService.go('bar').then(success, error);
  })));

  it('should support loadChildren on non-future state (manual state cleanup)', async(inject([UIRouter], (router: UIRouter) => {
    let { stateRegistry, stateService } = router;
    stateRegistry.register(augment1);
    stateRegistry.register(augment2);

    const fixture = TestBed.createComponent(UIView);
    fixture.detectChanges();

    let names = stateRegistry.get().map(state => state.name).sort();
    expect(names).toEqual(['', 'augment1', 'augment1.augment2']);

    const wait = (delay) => new Promise(resolve => setTimeout(resolve, delay));
    stateService.go('augment1.augment2').then(() => {
      fixture.detectChanges();
      expect(stateService.current.name).toBe('augment1.augment2');
      expect(fixture.debugElement.nativeElement.textContent.replace(/\s+/g, " ").trim()).toBe('Component 1 Component 2');
    })
  })));

});

