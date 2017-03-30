import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UIRouterModule } from '../src/uiRouterNgModule';
import { UISref } from '../src/directives/uiSref';

describe('uiSref', () => {
  describe('empty links', () => {
    @Component({
      template: `
        <a [uiSref]="null"></a>
        <a [uiSref]="''"></a>
      `
    })
    class TestComponent { }

    let des: DebugElement[];
    let comp: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      fixture = TestBed.configureTestingModule({
        declarations: [ TestComponent ],
        imports:      [ UIRouterModule ]
      }).createComponent(TestComponent);
      fixture.detectChanges();
      des = fixture.debugElement.queryAll(By.directive(UISref));
    });

    it('should not bind "null" string to `href`', () => {
      expect(des[0].nativeElement.hasAttribute('href')).toBeFalsy();
      expect(des[1].nativeElement.hasAttribute('href')).toBeFalsy();
    });
  });
});

