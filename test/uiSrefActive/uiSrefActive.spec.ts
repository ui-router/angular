import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UIRouter } from '@uirouter/core';
import { UISrefActive } from '../../src';
import { UIRouterModule } from '../../src/uiRouterNgModule';
import { tick } from '../testUtils';
import { describe, beforeEach, it, expect } from 'vitest';

describe('uiSrefActive', () => {
  const initialize = <T>(ComponentClass: Type<T>, states) => {
    const fixture = TestBed.configureTestingModule({
      declarations: [ComponentClass],
      imports: [UIRouterModule.forRoot({ useHash: true, states })],
    }).createComponent(ComponentClass);
    fixture.detectChanges();

    return fixture;
  };

  describe('with a simple class', () => {
    @Component({ template: `<a uiSref="statea" uiSrefActive="active">State A</a>`, standalone: false })
    class TestComponent {}
    let fixture: ComponentFixture<TestComponent>;
    beforeEach(() => (fixture = initialize(TestComponent, [{ name: 'statea' }])));

    it('does not apply the class when the link is active', () => {
      const des = fixture.debugElement.queryAll(By.directive(UISrefActive));
      expect(des[0].nativeElement.classList.length).toBe(0);
    });

    it('applies the class when the link is active', async () => {
      const des = fixture.debugElement.queryAll(By.directive(UISrefActive));
      const router = fixture.debugElement.injector.get(UIRouter);
      await router.stateService.go('statea');
      await tick();
      fixture.detectChanges();
      const classList = des[0].nativeElement.classList;
      expect(classList.length).toBe(1);
      expect(classList).toContain('active');
    });
  });

  describe('with multiple classes', () => {
    const activeClasses = ['active', 'active2'];

    @Component({
      template: `<a uiSref="statea" uiSrefActive="${activeClasses.join(' ')}">State A</a>`,
      standalone: false,
    })
    class TestComponent {}
    let fixture: ComponentFixture<TestComponent>;
    beforeEach(() => (fixture = initialize(TestComponent, [{ name: 'statea' }])));

    it('applies all classses when the link is active', async () => {
      const des = fixture.debugElement.queryAll(By.directive(UISrefActive));
      const router = fixture.debugElement.injector.get(UIRouter);
      await router.stateService.go('statea');
      await tick();
      fixture.detectChanges();
      let classList = des[0].nativeElement.classList;
      expect(classList).toContain(activeClasses[0]);
      expect(classList).toContain(activeClasses[1]);
    });
  });

  describe('on a parent element', () => {
    it('applies the active class when any child link is active', async () => {
      const template = `
      <li uiSrefActive="active">
        <a uiSref="statea">State A</a>
        <a uiSref="statec">State C</a>
      </li>
    `;
      @Component({ template, standalone: false })
      class TestComponent {}

      const fixture = initialize(TestComponent, [{ name: 'statea' }, { name: 'stateb' }, { name: 'statec' }]);

      const des = fixture.debugElement.queryAll(By.directive(UISrefActive));
      const router = fixture.debugElement.injector.get(UIRouter);

      await router.stateService.go('statea');
      await tick();
      fixture.detectChanges();
      expect(des[0].nativeElement.classList).toContain('active');

      await router.stateService.go('stateb');
      await tick();
      fixture.detectChanges();
      expect(des[0].nativeElement.classList).not.toContain('active');

      await router.stateService.go('statec');
      await tick();
      fixture.detectChanges();
      expect(des[0].nativeElement.classList).toContain('active');
    });

    // Test for https://github.com/ui-router/angular/issues/760
    // Verifies that dynamically adding/removing nested uiSref elements updates active state correctly.
    describe('dynamic uiSref toggling (GitHub #760)', () => {
      const createToggleFixture = (initialShowStateb: boolean) => {
        const template = `
          <li id="parent" uiSrefActive="active">
            <a uiSref="statea"></a>
            @if (showStateb) {
              <a uiSref="stateb"></a>
            }
          </li>
        `;
        @Component({ template, standalone: false })
        class ToggleTestComponent {
          public showStateb = initialShowStateb;
        }

        const states = [{ name: 'statea' }, { name: 'stateb' }, { name: 'statec' }];
        return initialize(ToggleTestComponent, states);
      };

      it('activates parent when stateb link is present and navigating to stateb', async () => {
        const fixture = createToggleFixture(true); // stateb link is visible
        const des = fixture.debugElement.queryAll(By.directive(UISrefActive));
        const router = fixture.debugElement.injector.get(UIRouter);

        await router.stateService.go('stateb');
        await tick();
        fixture.detectChanges();
        expect(des[0].nativeElement.classList).toContain('active');
      });

      it('does NOT activate parent when stateb link is hidden and navigating to stateb', async () => {
        const fixture = createToggleFixture(false); // stateb link is hidden
        const des = fixture.debugElement.queryAll(By.directive(UISrefActive));
        const router = fixture.debugElement.injector.get(UIRouter);

        await router.stateService.go('stateb');
        await tick();
        fixture.detectChanges();
        // Parent should NOT be active because stateb link doesn't exist
        expect(des[0].nativeElement.classList).not.toContain('active');
      });

      it('always activates parent when navigating to statea (regardless of stateb visibility)', async () => {
        // Test with stateb hidden
        const fixture1 = createToggleFixture(false);
        const des1 = fixture1.debugElement.queryAll(By.directive(UISrefActive));
        const router1 = fixture1.debugElement.injector.get(UIRouter);

        await router1.stateService.go('statea');
        await tick();
        fixture1.detectChanges();
        expect(des1[0].nativeElement.classList).toContain('active');
      });

      // This test verifies the DYNAMIC toggling behavior (the core #760 fix)
      // by toggling the visibility of stateb link at runtime.
      it('updates active state when dynamically showing/hiding uiSref element', async () => {
        const fixture = createToggleFixture(false); // Start with stateb link hidden
        const des = fixture.debugElement.queryAll(By.directive(UISrefActive));
        const router = fixture.debugElement.injector.get(UIRouter);

        // Navigate to stateb - parent should NOT be active (no stateb link exists)
        await router.stateService.go('stateb');
        await tick();
        fixture.detectChanges();
        expect(des[0].nativeElement.classList).not.toContain('active');

        // Now dynamically show the stateb link
        fixture.componentInstance.showStateb = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        await tick();
        await fixture.whenStable();

        // After showing stateb link, parent should NOW be active
        expect(des[0].nativeElement.classList).toContain('active');

        // Hide the stateb link again
        fixture.componentInstance.showStateb = false;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        await tick();
        await fixture.whenStable();

        // Parent should no longer be active
        expect(des[0].nativeElement.classList).not.toContain('active');
      });
    });
  });
});
