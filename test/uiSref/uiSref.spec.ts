import { APP_BASE_HREF } from '@angular/common';
import { Component, DebugElement, ViewChildren, QueryList } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi, describe, beforeEach, it, expect, type MockInstance } from 'vitest';

import { UIRouterModule } from '../../src/uiRouterNgModule';
import { UISref } from '../../src/directives/uiSref';
import { UIRouter, StateDeclaration, TargetState, TransitionOptions } from '@uirouter/core';
import { clickOnElement, tick } from '../testUtils';

describe('uiSref', () => {
  @Component({
    template: `
      <a [uiSref]="linkA" [target]="targetA" [uiParams]="linkAParams" [uiOptions]="linkAOptions"></a>
      <a [uiSref]="linkB"></a>
      <a [uiSref]="linkC"></a>
    `,
    standalone: false,
  })
  class TestComponent {
    linkA: string;
    linkAParams: any;
    linkAOptions: TransitionOptions;
    targetA: string;
    linkB: string;
    linkC: StateDeclaration;

    @ViewChildren(UISref) srefs: QueryList<UISref>;

    get linkASref() {
      return this.srefs.first;
    }

    constructor() {
      this.linkA = null;
      this.linkAParams = null;
      this.linkAOptions = null;
      this.targetA = '';
      this.linkB = '';
      this.linkC = {};
    }
  }

  const setup = (initialValues?: Partial<TestComponent>) => {
    const fixture = TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [UIRouterModule.forRoot({ useHash: true })],
      providers: [{ provide: APP_BASE_HREF, useValue: '/root' }],
    }).createComponent(TestComponent);

    // Set initial values BEFORE first detectChanges to avoid ExpressionChangedAfterItHasBeenChecked
    if (initialValues) {
      Object.assign(fixture.componentInstance, initialValues);
    }

    fixture.detectChanges();
    const srefElements = fixture.debugElement.queryAll(By.directive(UISref));
    const router = fixture.debugElement.injector.get(UIRouter);

    return { fixture, srefElements, router };
  };

  // Extract the logical portion of the URL after the hash
  const urlOfElement = (srefElement: DebugElement) => {
    let href = srefElement.nativeElement.href;
    if (typeof location === 'object' && href.startsWith(location.href)) {
      href = href.substr(location.href.length);
    }
    return href.replace(/^[^#]*#/, '');
  };

  it('renders an href for a state with an url', () => {
    const { fixture, srefElements, router } = setup({ linkA: 'urlstate' });
    router.stateRegistry.register({ name: 'urlstate', url: '/myurl' });
    fixture.detectChanges();
    expect(srefElements[0].nativeElement.hasAttribute('href')).toBeTruthy();
    expect(urlOfElement(srefElements[0])).toBe('/myurl');
  });

  it('renders an empty href for a url-less state', () => {
    const { fixture, srefElements, router } = setup({ linkA: 'urlless' });
    router.stateRegistry.register({ name: 'urlless' });
    fixture.detectChanges();
    expect(srefElements[0].nativeElement.hasAttribute('href')).toBeTruthy();
    expect(urlOfElement(srefElements[0])).toBe('');
  });

  it('renders no href when the sref state is empty', () => {
    const { srefElements } = setup({ linkA: null });
    expect(srefElements[0].nativeElement.hasAttribute('href')).toBeFalsy();
  });

  it('should ignore the click event when the sref state is empty', () => {
    const { srefElements, router } = setup({ linkA: null, linkB: null });
    const gospy = vi.spyOn(router.stateService, 'go');

    clickOnElement(srefElements[0]);
    expect(gospy).not.toHaveBeenCalled();

    clickOnElement(srefElements[0]);
    expect(gospy).not.toHaveBeenCalled();
  });

  it('should call stateService.go with the linked state when clicked', () => {
    const { srefElements, router } = setup({ linkA: 'stateref' });
    const gospy = vi.spyOn(router.stateService, 'go');
    clickOnElement(srefElements[0]);
    expect(gospy).toHaveBeenCalled();
    expect(gospy.mock.calls[0][0]).toBe('stateref');
  });

  it('should handle when param is stateDeclaration', () => {
    const { srefElements, router } = setup({ linkC: { name: 'stateref' } });
    const gospy = vi.spyOn(router.stateService, 'go');
    clickOnElement(srefElements[2]);
    expect(gospy).toHaveBeenCalledTimes(1);
    expect(gospy.mock.calls[0][0]).toEqual({ name: 'stateref' });
  });

  it('should ignore the click event when target is _blank', () => {
    const { fixture, srefElements, router } = setup({ linkA: 'statea', targetA: '_blank' });
    const gospy = vi.spyOn(router.stateService, 'go');
    router.stateRegistry.register({ name: 'statea', url: '/statea' });
    fixture.detectChanges();
    clickOnElement(srefElements[0]);
    expect(gospy).not.toHaveBeenCalled();
  });

  describe('opening in a new tab', () => {
    let srefElement: DebugElement;
    let gospy: MockInstance;

    beforeEach(() => {
      const { srefElements, router } = setup({ targetA: 'somestate' });
      srefElement = srefElements[0];
      gospy = vi.spyOn(router.stateService, 'go');
    });

    it('should fallback to the browser default when the button is not the left', () => {
      clickOnElement(srefElement, 1);
      expect(gospy).not.toHaveBeenCalled();
    });

    it('should fallback to the browser default when the button is not set', () => {
      clickOnElement(srefElement, null);
      expect(gospy).not.toHaveBeenCalled();
    });

    it('should fallback to the browser default when the meta key is pressed', () => {
      clickOnElement(srefElement, 0, true);
      expect(gospy).not.toHaveBeenCalled();
    });

    it('should fallback to the browser default when the ctrl key is pressed', () => {
      clickOnElement(srefElement, 0, false, true);
      expect(gospy).not.toHaveBeenCalled();
    });
  });

  describe('when applied to a link tag', () => {
    describe('when the bound values change', () => {
      // Each test creates its own fixture; reset TestBed before each to ensure isolation
      beforeEach(() => {
        TestBed.resetTestingModule();
      });

      const createTestFixture = () => {
        const fixture = TestBed.configureTestingModule({
          declarations: [TestComponent],
          imports: [UIRouterModule.forRoot({ useHash: true })],
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return fixture;
      };

      it('should emit an empty target state event when uiSref is empty', () => {
        const fixture = createTestFixture();
        const comp = fixture.componentInstance;
        const logger: TargetState[] = [];
        const subscription = comp.linkASref.targetState$.subscribe((evt) => logger.push(evt));

        expect(logger.length).toBe(1);
        expect(logger[0].name()).toBeNull();

        subscription.unsubscribe();
      });

      it('should emit an event when the target state changes', async () => {
        const fixture = createTestFixture();
        const comp = fixture.componentInstance;
        const logger: TargetState[] = [];
        const subscription = comp.linkASref.targetState$.subscribe((evt) => logger.push(evt));

        comp.linkA = 'stateA';
        await tick();
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(logger.length).toBe(2);
        expect(logger[1].name()).toBe('stateA');

        subscription.unsubscribe();
      });

      it('should emit an event when the target params change', async () => {
        const fixture = createTestFixture();
        const comp = fixture.componentInstance;
        const logger: TargetState[] = [];
        const subscription = comp.linkASref.targetState$.subscribe((evt) => logger.push(evt));

        const params = { paramA: 'paramA' };
        comp.linkAParams = params;
        await tick();
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(logger.length).toBe(2);
        expect(logger[1].params()).toEqual(params);

        subscription.unsubscribe();
      });

      it('should emit an event when the transition options change', async () => {
        const fixture = createTestFixture();
        const comp = fixture.componentInstance;
        const logger: TargetState[] = [];
        const subscription = comp.linkASref.targetState$.subscribe((evt) => logger.push(evt));

        const options: TransitionOptions = { custom: 'custom' };
        comp.linkAOptions = options;
        await tick();
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(logger.length).toBe(2);
        expect(logger[1].options().custom).toEqual(options.custom);

        subscription.unsubscribe();
      });
    });
  });
});
