import { APP_BASE_HREF } from '@angular/common';
import { Component, DebugElement, ViewChildren, QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UIRouterModule } from '../../src/uiRouterNgModule';
import { UISref } from '../../src/directives/uiSref';
import { UIRouter, TargetState, TransitionOptions } from '@uirouter/core';
import { Subscription } from 'rxjs';
import { clickOnElement } from '../testUtils';

describe('uiSref', () => {
  @Component({
    template: `
      <a [uiSref]="linkA" [target]="targetA" [uiParams]="linkAParams" [uiOptions]="linkAOptions"></a>
      <a [uiSref]="linkB"></a>
    `,
  })
  class TestComponent {
    linkA: string;
    linkAParams: any;
    linkAOptions: TransitionOptions;
    targetA: string;
    linkB: string;

    @ViewChildren(UISref) srefs: QueryList<UISref>;

    get linkASref() {
      return this.srefs.first;
    }

    get linkBSref() {
      return this.srefs.toArray()[1];
    }

    constructor() {
      this.linkA = null;
      this.linkAParams = null;
      this.linkAOptions = null;
      this.targetA = '';
      this.linkB = '';
    }
  }

  const setup = () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [UIRouterModule.forRoot({ useHash: true })],
      providers: [{ provide: APP_BASE_HREF, useValue: '/root' }],
    }).createComponent(TestComponent);
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
    const { fixture, srefElements, router } = setup();
    router.stateRegistry.register({ name: 'urlstate', url: '/myurl' });
    fixture.componentInstance.linkA = 'urlstate';
    fixture.detectChanges();
    expect(srefElements[0].nativeElement.hasAttribute('href')).toBeTruthy();
    expect(urlOfElement(srefElements[0])).toBe('/myurl');
  });

  it('renders an empty href for a url-less state', () => {
    const { fixture, srefElements, router } = setup();
    router.stateRegistry.register({ name: 'urlless' });
    fixture.componentInstance.linkA = 'urlless';
    fixture.detectChanges();
    expect(srefElements[0].nativeElement.hasAttribute('href')).toBeTruthy();
    expect(urlOfElement(srefElements[0])).toBe('');
  });

  it('renders no href when the sref state is empty', () => {
    const { fixture, srefElements } = setup();
    fixture.componentInstance.linkA = null;
    expect(srefElements[0].nativeElement.hasAttribute('href')).toBeFalsy();
  });

  it('should ignore the click event when the sref state is empty', () => {
    const { fixture, srefElements, router } = setup();
    const gospy = jest.spyOn(router.stateService, 'go');
    fixture.componentInstance.linkA = null;
    fixture.componentInstance.linkB = null;
    fixture.detectChanges();

    clickOnElement(srefElements[0]);
    expect(gospy).not.toHaveBeenCalled();

    clickOnElement(srefElements[0]);
    expect(gospy).not.toHaveBeenCalled();
  });

  it('should call stateService.go with the linked state when clicked', () => {
    const { fixture, srefElements, router } = setup();
    const gospy = jest.spyOn(router.stateService, 'go');
    fixture.componentInstance.linkA = 'stateref';
    fixture.detectChanges();
    clickOnElement(srefElements[0]);
    expect(gospy).toHaveBeenCalled();
    expect(gospy.mock.calls[0][0]).toBe('stateref');
  });

  it('should ignore the click event when target is _blank', () => {
    const { fixture, srefElements, router } = setup();
    const gospy = jest.spyOn(router.stateService, 'go');
    router.stateRegistry.register({ name: 'statea', url: '/statea' });
    fixture.componentInstance.linkA = 'statea';
    fixture.componentInstance.targetA = '_blank';
    fixture.detectChanges();
    clickOnElement(srefElements[0]);
    expect(gospy).not.toHaveBeenCalled();
  });

  describe('opening in a new tab', () => {
    let srefElement: DebugElement;
    let gospy: jest.SpyInstance;

    beforeEach(() => {
      const { fixture, srefElements, router } = setup();
      srefElement = srefElements[0];
      gospy = jest.spyOn(router.stateService, 'go');
      fixture.componentInstance.targetA = 'somestate';
      fixture.detectChanges();
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
      let fixture: ComponentFixture<TestComponent>;
      let comp: TestComponent;
      let logger: TargetState[];
      let subscription: Subscription;

      beforeEach(() => {
        fixture = TestBed.configureTestingModule({
          declarations: [TestComponent],
          imports: [UIRouterModule.forRoot({ useHash: true })],
        }).createComponent(TestComponent);
        fixture.detectChanges();
        comp = fixture.componentInstance;
        logger = [];
        subscription = comp.linkASref.targetState$.subscribe((evt) => logger.push(evt));
      });

      afterEach(() => {
        subscription.unsubscribe();
      });

      describe('when the uiSref is empty', () => {
        it('should emit an empty target state event', () => {
          expect(logger.length).toBe(1);
          expect(logger[0].name()).toBeNull();
        });
      });

      describe('when the target state changes', () => {
        beforeEach(() => {
          comp.linkA = 'stateA';
          fixture.detectChanges();
        });

        it('should emit an event', () => {
          expect(logger.length).toBe(2);
          expect(logger[1].name()).toBe('stateA');
        });
      });

      describe('when the target params change', () => {
        const params = { paramA: 'paramA' };

        beforeEach(() => {
          comp.linkAParams = params;
          fixture.detectChanges();
        });

        it('should emit an event', () => {
          expect(logger.length).toBe(2);
          expect(logger[1].params()).toEqual(params);
        });
      });

      describe('when the transition options change', () => {
        const options: TransitionOptions = { custom: 'custom' };

        beforeEach(() => {
          comp.linkAOptions = options;
          fixture.detectChanges();
        });

        it('should emit an event', () => {
          expect(logger.length).toBe(2);
          expect(logger[1].options().custom).toEqual(options.custom);
        });
      });
    });
  });
});
