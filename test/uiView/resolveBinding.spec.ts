import { Component, Inject, input, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ng2StateDeclaration, UIRouterModule, UIView } from '../../src';
import { By } from '@angular/platform-browser';
import { Resolvable, UIRouter } from '@uirouter/core';
import { describe, beforeEach, it, expect } from 'vitest';

describe('uiView', () => {
  describe('should map resolve data to inputs', () => {
    @Component({ template: `<h3>hey</h3> `, standalone: false })
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
      @Input({ alias: 'resolve6' }) _resolve6;
      @Input({ alias: 'resolve7' }) _resolve7;
      @Input({ transform: (value: string) => `${value}1` }) resolve8;
      resolve9 = input<string>('');
      resolve10 = input<string>('');
      _resolve11 = input<string>('', { alias: 'resolve11' });
      _resolve12 = input<string>('', { alias: 'resolve12' });
      resolve13 = input<string, string>('', { transform: (value) => `${value}1` });
    }

    let comp: ManyResolvesComponent;
    let fixture: ComponentFixture<UIView>;
    let router: UIRouter;

    beforeEach(async () => {
      const manyResolves: Ng2StateDeclaration = {
        name: 'manyResolves',
        component: ManyResolvesComponent,
        bindings: {
          // component_input: 'resolve name'
          resolve2: 'Resolve2',
          resolve4: 'Resolve4',
          resolve7: 'Resolve7',
          resolve10: 'Resolve10',
          resolve12: 'Resolve12',
        },
        resolve: [
          { token: 'resolve1', resolveFn: () => 'resolve1' },
          { token: 'Resolve2', resolveFn: () => 'resolve2' },
          { token: 'resolve3', resolveFn: () => 'resolve3' },
          { token: 'Resolve4', resolveFn: () => 'resolve4' },
          new Resolvable('resolve5', () => 'resolve5', [], { async: 'NOWAIT' }),
          { token: 'resolve6', resolveFn: () => 'resolve6' },
          { token: 'Resolve7', resolveFn: () => 'resolve7' },
          { token: 'resolve8', resolveFn: () => 'resolve8' },
          { token: 'resolve9', resolveFn: () => 'resolve9' },
          { token: 'Resolve10', resolveFn: () => 'resolve10' },
          { token: 'resolve11', resolveFn: () => 'resolve11' },
          { token: 'Resolve12', resolveFn: () => 'resolve12' },
          { token: 'resolve13', resolveFn: () => 'resolve13' },
        ],
      };

      const routerModule = UIRouterModule.forRoot({ useHash: true, states: [manyResolves] });

      fixture = TestBed.configureTestingModule({
        declarations: [ManyResolvesComponent],
        imports: [routerModule],
      }).createComponent(UIView);

      fixture.detectChanges();
      router = fixture.debugElement.injector.get(UIRouter);
      await router.stateService.go('manyResolves');
      comp = fixture.debugElement.query(By.directive(ManyResolvesComponent)).componentInstance;
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

    it('should bind resolve by alias to component input templateName', () => {
      expect(comp._resolve6).toBe('resolve6');
    });

    it('should bind resolve by alias to the component input templateName specified in state `bindings`', () => {
      expect(comp._resolve7).toBe('resolve7');
    });

    it('should bind resolve to the component input name and transform its value', () => {
      expect(comp.resolve8).toBe('resolve81');
    });

    it('should bind resolve by name to component input signal name', () => {
      expect(comp.resolve9()).toBe('resolve9');
    });

    it('should bind resolve by name to the component input signal specified by `bindings`', () => {
      expect(comp.resolve10()).toBe('resolve10');
    });

    it('should bind resolve by name to component input signal templateName', () => {
      expect(comp._resolve11()).toBe('resolve11');
    });

    it('should bind resolve by name to the component input signal templateName specified in state `bindings`', () => {
      expect(comp._resolve12()).toBe('resolve12');
    });

    it('should bind resolve to the component input signal name and transform its value', () => {
      expect(comp.resolve13()).toBe('resolve131');
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
