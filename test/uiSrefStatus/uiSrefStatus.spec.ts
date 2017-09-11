import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SrefStatus, UISrefStatus } from '../../src/directives/uiSrefStatus';
import { UIRouterModule } from '../../src/uiRouterNgModule';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [UIRouterModule.forRoot({
        states: [{ name: 'foo' }],
        useHash: true,
      })]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.directive(UISrefStatus));
  });

  describe('when click on `foo` uiSref', () => {
    beforeEach(async(() => {
      spyOn(component, 'updated');
      de.triggerEventHandler('click', {});
    }));

    it('should emit a event with identifier equals to `foo`', () => {
      expect(component.updated).toHaveBeenCalledWith(jasmine.objectContaining({
        identifier: 'foo',
      }));
    });
  });
});
