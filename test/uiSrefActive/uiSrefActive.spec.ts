import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UIRouter } from '@uirouter/core';
import { UIRouterModule } from '../../src/uiRouterNgModule';
import { UISrefActive } from '../../src';

describe('uiSrefActive', () => {
  const tick = () => new Promise(resolve => setTimeout(resolve));

  const initialize = (Component, states) => {
    const fixture = TestBed.configureTestingModule({
      declarations: [Component],
      imports: [UIRouterModule.forRoot({ useHash: true, states })],
    }).createComponent(Component);
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
});
