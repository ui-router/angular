import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UIRouterModule } from '../../src/uiRouterNgModule';
import { UISref } from '../../src/directives/uiSref';
import { UIRouter } from '@uirouter/core';
import { Subject } from 'rxjs/Subject';

describe('uiSref', () => {
  @Component({
    template: `
      <a [uiSref]="linkA" [target]="targetA"></a>
      <a [uiSref]="linkB"></a>
    `
  })
  class TestComponent {
    linkA: string;
    targetA: string;
    linkB: string;

    constructor() {
      this.linkA = null;
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
            des[0].triggerEventHandler('click', {});
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
            des[0].triggerEventHandler('click', {});
          });

          it('should navigate to the state', () => {
            expect(uiRouterMock.stateService.go).toHaveBeenCalled();
          });
        });
      });
    });
  });
});

