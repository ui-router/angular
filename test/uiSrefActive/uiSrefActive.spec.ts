import { Component, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UIRouter } from '@uirouter/core';
import { UISrefActive } from '../../src';
import { UIRouterModule } from '../../src/uiRouterNgModule';

describe('uiSrefActive', () => {
  const tick = () => new Promise((resolve) => setTimeout(resolve));

  const initialize = <T>(ComponentClass: Type<T>, states) => {
    const fixture = TestBed.configureTestingModule({
      declarations: [ComponentClass],
      imports: [UIRouterModule.forRoot({ useHash: true, states })],
    }).createComponent(ComponentClass);
    fixture.detectChanges();

    return fixture;
  };

  describe('with a simple class', () => {
    @Component({ template: `<a uiSref="statea" uiSrefActive="active">State A</a>` })
    class TestComponent {}
    let fixture: ComponentFixture<TestComponent>;
    beforeEach(() => (fixture = initialize(TestComponent, [{ name: 'statea' }])));

    it('does not apply the class when the link is active', () => {
      const des = fixture.debugElement.queryAll(By.directive(UISrefActive));
      expect(des[0].nativeElement.classList.length).toBe(0);
    });

    it('applies the class when the link is active', async(() => {
      const des = fixture.debugElement.queryAll(By.directive(UISrefActive));
      const router = fixture.debugElement.injector.get(UIRouter);
      router.stateService
        .go('statea')
        .then(tick)
        .then(() => {
          const classList = des[0].nativeElement.classList;
          expect(classList.length).toBe(1);
          expect(classList).toContain('active');
        });
    }));
  });

  describe('with multiple classes', () => {
    const activeClasses = ['active', 'active2'];

    @Component({ template: `<a uiSref="statea" uiSrefActive="${activeClasses.join(' ')}">State A</a>` })
    class TestComponent {}
    let fixture: ComponentFixture<TestComponent>;
    beforeEach(() => (fixture = initialize(TestComponent, [{ name: 'statea' }])));

    it('applies all classses when the link is active', async(() => {
      const des = fixture.debugElement.queryAll(By.directive(UISrefActive));
      const router = fixture.debugElement.injector.get(UIRouter);
      router.stateService
        .go('statea')
        .then(tick)
        .then(() => {
          let classList = des[0].nativeElement.classList;
          expect(classList).toContain(activeClasses[0]);
          expect(classList).toContain(activeClasses[1]);
        });
    }));
  });

  describe('on a parent element', () => {
    it('applies the active class when any child link is active', async(async () => {
      const template = `
      <li uiSrefActive="active">
        <a uiSref="statea">State A</a>
        <a uiSref="statec">State C</a>
      </li>
    `;
      @Component({ template })
      class TestComponent {}

      const fixture = initialize(TestComponent, [{ name: 'statea' }, { name: 'stateb' }, { name: 'statec' }]);

      const des = fixture.debugElement.queryAll(By.directive(UISrefActive));
      const router = fixture.debugElement.injector.get(UIRouter);

      await router.stateService.go('statea').then(tick);
      expect(des[0].nativeElement.classList).toContain('active');

      await router.stateService.go('stateb').then(tick);
      expect(des[0].nativeElement.classList).not.toContain('active');

      await router.stateService.go('statec').then(tick);
      expect(des[0].nativeElement.classList).toContain('active');
    }));

    // Test for https://github.com/ui-router/angular/issues/760
    it('can dynamically add or remove nested uiSref', async(async () => {
      const template = `
        <li id="parent" uiSrefActive="active">
          <a uiSref="statea"></a>
          <a uiSref="stateb" *ngIf="show"></a>
        </li>
      `;
      @Component({ template })
      class TestComponent {
        public show = false;
      }

      const states = [{ name: 'statea' }, { name: 'stateb' }, { name: 'statec' }];
      const fixture = initialize(TestComponent, states);

      const des = fixture.debugElement.queryAll(By.directive(UISrefActive));
      const router = fixture.debugElement.injector.get(UIRouter);

      await router.stateService.go('statea').then(tick);
      expect(des[0].nativeElement.classList).toContain('active');

      fixture.componentInstance.show = true;
      fixture.detectChanges();

      await router.stateService.go('stateb').then(tick);
      expect(des[0].nativeElement.classList).toContain('active');

      await router.stateService.go('statec').then(tick);
      expect(des[0].nativeElement.classList).not.toContain('active');
    }));
  });
});
