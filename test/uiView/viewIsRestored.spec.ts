import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Ng2StateDeclaration, UIRouterModule, UIView } from "../../src";
import { UIRouter } from "@uirouter/core";
import { By } from '@angular/platform-browser';

describe("uiView", () => {

  describe("ui-view restores projected content when navigating back to parent state from child state", () => {

    @Component({ selector: "app-parent", template: '<ui-view><h1>Parent</h1></ui-view>', standalone: false })
    class ParentComponent { }

    @Component({ selector: "app-child", template: '<h2>Child</h2>', standalone: false })
    class ChildComponent { }

    const parentState: Ng2StateDeclaration = { name: "parent", url: "/", component: ParentComponent }
    const childState: Ng2StateDeclaration = { name: "parent.child", url: "/child", component: ChildComponent }
    let fixture: ComponentFixture<UIView>;
    let router: UIRouter;

    beforeEach(async () => {
      fixture = TestBed.configureTestingModule({
        imports: [
          UIRouterModule.forRoot({ useHash: true, states: [parentState, childState] })
        ],
        declarations: [
          ParentComponent,
          ChildComponent
        ]
      })
        .createComponent(UIView);
      fixture.detectChanges();
      router = fixture.debugElement.injector.get(UIRouter);
      await router.stateService.go('parent');
    });

    afterEach(() => TestBed.resetTestingModule());

    it("should show parent component", () => {
      fixture.detectChanges();
      const parentInstance = fixture.debugElement.query(By.directive(ParentComponent)).componentInstance;
      expect(parentInstance).toBeInstanceOf(ParentComponent);
      const h1Elelement = fixture.debugElement.query(By.css("h1"));
      expect(h1Elelement).toBeTruthy();
      const h2Elelement = fixture.debugElement.query(By.css("h2"));
      expect(h2Elelement).toBeFalsy();
    });

    it("should the child component", async () => {
      await router.stateService.go("parent.child");
      fixture.detectChanges();
      const childInstance = fixture.debugElement.query(By.directive(ChildComponent)).componentInstance;
      expect(childInstance).toBeInstanceOf(ChildComponent);
      const h1Elelement = fixture.debugElement.query(By.css("h1"));
      expect(h1Elelement).toBeFalsy();
      const h2Elelement = fixture.debugElement.query(By.css("h2"));
      expect(h2Elelement).toBeTruthy();
    });

    it("should restore the h1 element.", async () => {
      await router.stateService.go("parent.child");
      fixture.detectChanges();
      await router.stateService.go("^");
      fixture.detectChanges();
      const parentInstance = fixture.debugElement.query(By.directive(ParentComponent)).componentInstance;
      expect(parentInstance).toBeInstanceOf(ParentComponent);
      const h2Elelement = fixture.debugElement.query(By.css("h2"));
      expect(h2Elelement).toBeFalsy();
      const h1Elelement = fixture.debugElement.query(By.css("h1"));
      expect(h1Elelement).toBeTruthy();
    });

  });

});
