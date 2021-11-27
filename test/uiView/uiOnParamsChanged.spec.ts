import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ng2StateDeclaration, UIRouterModule, UIView } from '../../src';
import { memoryLocationPlugin, Transition, UIRouter } from '@uirouter/core';
import { APP_BASE_HREF } from '@angular/common';

describe('uiView', () => {
  describe('should map resolve data to inputs', () => {
    type Params = { [paramName: string]: any };

    let paramChanges: Params[];
    let lifecycle: string[];

    let fixture: ComponentFixture<UIView>;
    let router: UIRouter;

    let id = 0;

    @Component({ template: `<h3>hey</h3> ` })
    class ParamWatcherComponent {
      $id = id++;

      public uiOnParamsChanged(newParams: { [paramName: string]: any }, trans: Transition) {
        paramChanges.push(newParams);
      }

      public ngOnInit() {
        lifecycle.push(`ngOnInit-${this.$id}`);
      }

      public ngOnDestroy() {
        lifecycle.push(`ngOnDestroy-${this.$id}`);
      }
    }

    beforeEach(done => {
      id = 0;
      paramChanges = [];
      lifecycle = [];

      const hasDynamicParams: Ng2StateDeclaration = {
        name: 'hasDynamicParams',
        component: ParamWatcherComponent,
        url: '/url/:param1/:param2?param3',
        params: {
          param2: { dynamic: true },
          param3: { dynamic: true },
        },
      };

      const config = (router: UIRouter) => router.plugin(memoryLocationPlugin);
      const routerModule = UIRouterModule.forRoot({ config, states: [hasDynamicParams] });

      fixture = TestBed.configureTestingModule({
        declarations: [ParamWatcherComponent],
        imports: [routerModule],
        providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      }).createComponent(UIView);
      fixture.detectChanges();

      router = fixture.debugElement.injector.get(UIRouter);

      done();
    });

    afterEach(() => {
      router.urlService.url('');
      router.dispose();
      fixture.destroy();
    });

    ////////////////////////////////////////////////////////////////////////////////

    it('should not receive the initial parameter values', async () => {
      expect(lifecycle).toEqual([]);

      await router.stateService.go('hasDynamicParams', { param1: 'foo1', param2: 'bar1' });
      fixture.detectChanges();

      expect(lifecycle).toEqual(['ngOnInit-0']);
      expect(paramChanges).toEqual([]);
    });

    it('should receive dynamic parameter changes', async () => {
      expect(lifecycle).toEqual([]);

      await router.stateService.go('hasDynamicParams', { param1: 'foo3', param2: 'bar3' });
      fixture.detectChanges();

      expect(lifecycle).toEqual(['ngOnInit-0']);
      expect(paramChanges).toEqual([]);
    });

    it('should receive dynamic parameter changes', async () => {
      expect(lifecycle).toEqual([]);

      await router.stateService.go('hasDynamicParams', { param1: 'foo', param2: 'bar' });
      fixture.detectChanges();

      expect(lifecycle).toEqual(['ngOnInit-0']);

      await router.stateService.go('.', { param2: 'notbar' });
      fixture.detectChanges();

      expect(lifecycle).toEqual(['ngOnInit-0']);
      expect(paramChanges).toEqual([{ param2: 'notbar' }]);
    });

    it('should receive multiple parameter changes', async () => {
      expect(lifecycle).toEqual([]);

      await router.stateService.go('hasDynamicParams', { param1: 'foo', param2: 'bar' });
      fixture.detectChanges();

      expect(lifecycle).toEqual(['ngOnInit-0']);
      await router.stateService.go('.', { param2: 'notbar', param3: 'baz' });
      fixture.detectChanges();

      expect(lifecycle).toEqual(['ngOnInit-0']);
      expect(paramChanges).toEqual([{ param2: 'notbar', param3: 'baz' }]);
    });

    it('should not receive non-dynamic parameter changes', async () => {
      expect(lifecycle).toEqual([]);

      await router.stateService.go('hasDynamicParams', { param1: 'foo', param2: 'bar' });
      fixture.detectChanges();

      expect(lifecycle).toEqual(['ngOnInit-0']);

      await router.stateService.go('hasDynamicParams', { param1: 'notfoo' });
      fixture.detectChanges();

      expect(lifecycle).toEqual(['ngOnInit-0', 'ngOnDestroy-0', 'ngOnInit-1']);
      expect(paramChanges).toEqual([]);
    });
  });
});
