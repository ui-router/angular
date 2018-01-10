import { Component, DebugElement, Input, NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UIRouterModule } from '../../src/uiRouterNgModule';
import { Ng2StateDeclaration } from '../../src/interface';
import { UIView } from '../../src/directives/uiView';
import { By } from '@angular/platform-browser';
import { UIRouter } from '@uirouter/core';

describe('uiView', () => {

  describe('should map resolve data to inputs', () => {
    @Component({ template: `<h3>hey</h3> ` })
    class ManyResolvesComponent {
      @Input() resolve1;
      @Input() resolve2;
      @Input('resolve3') _resolve3;
      @Input('resolve4') _resolve4;
    }

    let comp: ManyResolvesComponent;
    let fixture: ComponentFixture<UIView>;
    let router: UIRouter;

    beforeEach((done) => {
      const manyResolves: Ng2StateDeclaration = {
        name: 'manyResolves',
        component: ManyResolvesComponent,
        bindings: {
          // component_input: 'resolve name'
          resolve2: 'Resolve2',
          resolve4: 'Resolve4',
        },
        resolve: [
          { token: 'resolve1', resolveFn: () => 'resolve1' },
          { token: 'Resolve2', resolveFn: () => 'resolve2' },
          { token: 'resolve3', resolveFn: () => 'resolve3' },
          { token: 'Resolve4', resolveFn: () => 'resolve4' },
        ],
      };

      const routerModule = UIRouterModule.forRoot({ useHash: true, states: [manyResolves] });

      fixture = TestBed.configureTestingModule({
        declarations: [ManyResolvesComponent],
        imports: [routerModule],
      }).createComponent(UIView);

      fixture.detectChanges();
      router = fixture.debugElement.injector.get(UIRouter);
      router.stateService.go('manyResolves').then(() => {
        comp = fixture.debugElement.query(By.directive(ManyResolvesComponent)).componentInstance;
        done();
      });
    });

    it('should bind resolve by name to component input name', () => {
      expect(comp.resolve1).toBe('resolve1');
    });

    it('should bind resolve by name to the component input specified by `bindings`', () => {
      expect(comp.resolve2).toBe('resolve2');
    });

    it('should bind resolve by name to component input templateName', () => {
      expect(comp._resolve3).toBe('resolve3');
    });

    it('should bind resolve by name to the component input templateName specified in state `bindings`', () => {
      expect(comp._resolve4).toBe('resolve4');
    });
  });
});
