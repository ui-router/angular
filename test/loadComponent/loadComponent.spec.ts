import { memoryLocationPlugin, UIRouter } from "@uirouter/core";
import { UIRouterModule } from "../../src/uiRouterNgModule";
import { inject, TestBed, waitForAsync } from "@angular/core/testing";
import { UIView } from "../../src/directives/uiView";
import { Ng2StateDeclaration } from "../../src/interface";

const fooState = {
  name: 'foo',
  url: '/foo',
  loadComponent: () => import("./foo/foo.component").then(result => result.FooComponent)
};

const barState = {
  name: 'bar',
  url: '/bar',
  loadComponent: () => import("./bar/bar.component").then(result => result.BarComponent)
};

function configFn(router: UIRouter) {
  router.plugin(memoryLocationPlugin);
}

describe('lazy loading', () => {

  beforeEach(() => {
    const routerModule = UIRouterModule.forRoot({ useHash: true, states: [], config: configFn });
    TestBed.configureTestingModule({
      declarations: [],
      imports: [routerModule]
    });
  });

  it('should lazy load a standalone component', waitForAsync(
    inject([UIRouter], ({ stateRegistry, stateService, globals }: UIRouter) => {
      stateRegistry.register(fooState);
      const fixture = TestBed.createComponent(UIView);
      fixture.detectChanges();
      const names = stateRegistry.get().map(state => state.name).sort();
      expect(names.length).toBe(2);
      expect(names).toEqual(['', 'foo']);

      stateService.go('foo')
        .then(() => {
          expect(globals.current.name).toBe('foo');
          expect((globals.current as Ng2StateDeclaration).component).toBeTruthy();
          const innerText = fixture.debugElement.nativeElement.textContent.replace(/\s+/g, ' ').trim();
          expect(innerText).toBe('FOO');
        });
    })
  ));

  it('should throw error if component is not standalone', waitForAsync(
    inject([UIRouter], ({ stateRegistry, stateService }: UIRouter) => {
      stateRegistry.register(barState);
      const fixture = TestBed.createComponent(UIView);
      fixture.detectChanges();
      const names = stateRegistry.get().map(state => state.name).sort();
      expect(names.length).toBe(2);
      expect(names).toEqual(['', 'bar']);

      const success = () => { throw Error('success not expected') };
      const error = err => expect(err.detail.message).toBe("Is not a standalone component.");
      stateService.go('bar').then(success, error);
    })
  ));
});
