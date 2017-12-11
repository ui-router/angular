import { Component, DebugElement, ViewChildren, QueryList } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UIRouterModule } from '../../src/uiRouterNgModule';
import { UISref } from '../../src/directives/uiSref';
import { UIRouter, TargetState, TransitionOptions } from '@uirouter/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from "rxjs/Subscription";
import { clickOnElement } from "../testUtils";

describe('uiSref', () => {
  @Component({
    template: `
      <a [uiSref]="linkA" [target]="targetA" [uiParams]="linkAParams" [uiOptions]="linkAOptions"></a>
      <a [uiSref]="linkB"></a>
    `
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

  describe('when applied to a link tag', () => {
    describe('when the uiSref is empty', () => {
      let des: DebugElement[];
      let fixture: ComponentFixture<TestComponent>;

      beforeEach(() => {
        fixture = TestBed.configureTestingModule({
          declarations: [TestComponent],
          imports: [UIRouterModule.forRoot({ useHash: true })]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        des = fixture.debugElement.queryAll(By.directive(UISref));
      });


      it('should not bind "null" string to `href`', () => {
        expect(des[0].nativeElement.hasAttribute('href')).toBeFalsy();
        expect(des[1].nativeElement.hasAttribute('href')).toBeFalsy();
      });
    });

    describe('when the uiSref is not empty', () => {
      let des: DebugElement[];
      let comp: TestComponent;
      let uiRouterMock: UIRouter;
      let fixture: ComponentFixture<TestComponent>;

      beforeEach(async(() => {
        uiRouterMock = {
          globals: {
            states$: new Subject()
          },
          stateService: jasmine.createSpyObj('stateService', ['go', 'target', 'href'])
        } as any;
        TestBed.configureTestingModule({
          declarations: [TestComponent],
          imports: [UIRouterModule.forRoot({ useHash: true })]
        }).overrideComponent(TestComponent, {
          set: {
            providers: [
              { provide: UIRouter, useValue: uiRouterMock }
            ]
          }
        }).compileComponents();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);

        comp = fixture.componentInstance;
        comp.linkA = '';
        fixture.detectChanges();
        des = fixture.debugElement.queryAll(By.directive(UISref));
      });

      describe('when target is _blank', () => {
        beforeEach(() => {
          comp.targetA = '_blank';
          fixture.detectChanges();
        });

        describe('when clicked', () => {
          beforeEach(() => {
            clickOnElement(des[0]);
          });

          it('should ignore the click event', () => {
            expect(uiRouterMock.stateService.go).not.toHaveBeenCalled();
          });
        });
      });

      describe('when target is not _blank', () => {
        beforeEach(() => {
          comp.targetA = '';
          fixture.detectChanges();
        });

        describe('when clicked', () => {
          beforeEach(() => {
            clickOnElement(des[0]);
          });

          it('should navigate to the state', () => {
            expect(uiRouterMock.stateService.go).toHaveBeenCalled();
          });
        });
      });

      describe('opening in a new tab', () => {
        beforeEach(() => {
          comp.targetA = '';
          fixture.detectChanges();
        });

        it('should fallback to the browser default when the button is not the left', () => {
          clickOnElement(des[0], 1);
          expect(uiRouterMock.stateService.go).not.toHaveBeenCalled();
        });

        it('should fallback to the browser default when the button is not set', () => {
          clickOnElement(des[0], null);
          expect(uiRouterMock.stateService.go).not.toHaveBeenCalled();
        });

        it('should fallback to the browser default when the meta key is pressed', () => {
          clickOnElement(des[0], 0, true);
          expect(uiRouterMock.stateService.go).not.toHaveBeenCalled();
        });

        it('should fallback to the browser default when the ctrl key is pressed', () => {
          clickOnElement(des[0], 0, false, true);
          expect(uiRouterMock.stateService.go).not.toHaveBeenCalled();
        });
      });

    });

    describe('when the bound values change', () => {
      let fixture: ComponentFixture<TestComponent>;
      let comp: TestComponent;
      let logger: TargetState[];
      let subscription: Subscription;

      beforeEach(() => {
        fixture = TestBed.configureTestingModule({
          declarations: [TestComponent],
          imports: [UIRouterModule.forRoot({ useHash: true })]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        comp = fixture.componentInstance;
        logger = [];
        subscription = comp.linkASref.targetState$.subscribe(evt => logger.push(evt));
      });

      afterEach(() => {
        subscription.unsubscribe();
      });

      describe('when the uiSref is empty', () => {
        it('should emit an empty target state event', () =>{
          expect(logger.length).toBe(1);
          expect(logger[0].name()).toBeNull();
        });
      })

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

        it ('should emit an event', () => {
          expect(logger.length).toBe(2);
          expect(logger[1].options().custom).toEqual(options.custom);
        });
      })
    });
  });
});

