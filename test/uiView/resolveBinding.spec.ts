import { Component, Inject, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ng2StateDeclaration, UIRouterModule, UIView } from '../../src';
import { By } from '@angular/platform-browser';
import { Resolvable, UIRouter } from '@uirouter/core';

describe('uiView', () => {
  describe('should map resolve data to inputs', () => {
    @Component({ template: `<h3>hey</h3> ` })
    class ManyResolvesComponent {
      constructor(@Inject('resolve1') foo, @Inject('Resolve2') bar, @Inject('resolve5') baz) {
        this.injectedValues = Array.from(arguments);
      }

      injectedValues: any[];
      @Input() resolve1;
      @Input() resolve2;
      @Input('resolve3') _resolve3;
      @Input('resolve4') _resolve4;
      @Input() resolve5;
    }

    let comp: ManyResolvesComponent;
    let fixture: ComponentFixture<UIView>;
    let router: UIRouter;

    beforeEach(done => {
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
          new Resolvable('resolve5', () => 'resolve5', [], { async: 'NOWAIT' }),
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

    /////////////////////////////////////////

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

    it('should bind NOWAIT resolve as a promise object', () => {
      expect(comp.resolve5).toBeDefined();
      expect(typeof comp.resolve5.then).toBe('function');
    });

    /////////////////////////////////////////

    it('should inject resolve by name to constructor', () => {
      expect(comp.injectedValues[0]).toBe('resolve1');
    });

    it('should inject resolve by resolve name (not binding name) to the constructor', () => {
      expect(comp.injectedValues[1]).toBe('resolve2');
    });

    it('should inject NOWAIT resolve as a promise object', () => {
      expect(comp.injectedValues[2]).toBeDefined();
      expect(typeof comp.injectedValues[2]).toBe('object');
      expect(typeof comp.injectedValues[2].then).toBe('function');
    });
  });
});
