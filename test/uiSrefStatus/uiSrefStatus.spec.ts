import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UISref } from '../../src';

import { SrefStatus, UISrefStatus } from '../../src/directives/uiSrefStatus';
import { UIRouterModule } from '../../src/uiRouterNgModule';
import { clickOnElement, tick } from '../testUtils';

describe('uiSrefStatus', () => {
  @Component({
    template: '<a uiSref="foo" (uiSrefStatus)="updated($event)"></a>',
  })
  class TestComponent {
    updated(event: SrefStatus) {
      throw new Error('updated() method must be spied');
    }
  }

  let component: TestComponent;
  let de: DebugElement;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        UIRouterModule.forRoot({
          states: [{ name: 'foo' }],
          useHash: true,
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.directive(UISref));
  });

  describe('when click on `foo` uiSref', () => {
    it('should emit a event with a TargetState pointing to `foo`', async () => {
      const spy = jest.spyOn(component, 'updated').mockImplementation(() => {});
      clickOnElement(de);
      await tick();
      expect(spy).toHaveBeenCalledTimes(2);

      const arg: SrefStatus = spy.mock.calls[1][0];
      expect(arg.targetStates.length).toEqual(1);
      expect(arg.targetStates[0].state()).toEqual(expect.objectContaining({ name: 'foo' }));
    });
  });
});
