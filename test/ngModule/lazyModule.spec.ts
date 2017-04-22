import { async, inject, TestBed } from '@angular/core/testing';
import { UIRouterModule } from '../../src/uiRouterNgModule';
import { UIView } from '../../src/directives/uiView';
import { memoryLocationPlugin, UIRouter } from '@uirouter/core';
import { NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';

declare var System;

let futureFoo = {
  name: 'foo.**',
  url: '/foo',
  loadChildren: () => System.import('./foo/foo.module').then(x => x.FooModule)
};

function configFn(router: UIRouter) {
  router.plugin(memoryLocationPlugin);
}

beforeEach(() => {
  let routerModule = UIRouterModule.forRoot({ useHash: true, states: [futureFoo], config: configFn });

  TestBed.configureTestingModule({
    declarations: [],
    imports: [routerModule],
    providers: [
      { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    ]
  });
});

describe('lazy loading', () => {

  it('should lazy load a module', async(inject([UIRouter], (router: UIRouter) => {
    const fixture = TestBed.createComponent(UIView);
    fixture.detectChanges();

    let { stateRegistry, stateService, globals } = router;

    let names = stateRegistry.get().map(state => state.name).sort();
    expect(names.length).toBe(2);
    expect(names).toEqual(['', 'foo.**']);

    stateService.go('foo').then(() => {
      expect(globals.current.name).toBe('foo');

      names = stateRegistry.get().map(state => state.name).sort();
      expect(names.length).toBe(4);
      expect(names).toEqual(['', 'foo', 'foo.child1', 'foo.child2']);
    })
  })));


});

