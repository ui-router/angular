import { Component } from '@angular/core';
import { ng2ViewsBuilder } from '../../src/statebuilders/views';
import { StateObject, StateRegistry, UIRouter } from '@uirouter/core';


describe('views statebuilder', () => {
  let router: UIRouter;
  let root: StateObject;
  @Component({ template: '<h1>foo</h1>' }) class Cmp {}
  @Component({ template: '<h1>foo2</h1>' }) class Cmp2 {}

  beforeEach(() => {
    router = new UIRouter();
    root = router.stateRegistry.root();
  });

  it('should process the default view found on the state declaration', () => {
    const state = {
      parent: root,
      component: Cmp,
      name: 'statename',
    } as any as StateObject;

    const expectedViews = {
      $default: {
        $type: 'ng2',
        $name: '$default',
        $uiViewName: '$default',
        $uiViewContextAnchor: root.name,
        $context: state,
        component: Cmp,
      }
    };

    expect(ng2ViewsBuilder(state)).toEqual(expectedViews)
  });

  it('should process the default view found in the views declaration', () => {
    const state = {
      parent: root,
      name: 'statename',
      views: {
        $default: { component: Cmp },
      }
    } as any as StateObject;

    const expectedViews = {
      $default: {
        $type: 'ng2',
        $name: '$default',
        $uiViewName: '$default',
        $uiViewContextAnchor: root.name,
        $context: state,
        component: Cmp,
      }
    };

    const actual = ng2ViewsBuilder(state);
    expect(actual).toEqual(expectedViews)
  });

  it('should prefer the default view found in the views declaration', () => {
    const state = {
      parent: root,
      name: 'statename',
      cmp: Cmp2,
      views: {
        $default: { component: Cmp },
      }
    } as any as StateObject;

    const expectedViews = {
      $default: {
        $type: 'ng2',
        $name: '$default',
        $uiViewName: '$default',
        $uiViewContextAnchor: root.name,
        $context: state,
        component: Cmp,
      }
    };

    const actual = ng2ViewsBuilder(state);
    expect(actual).toEqual(expectedViews)
  });

  it('should process other named views found in the views declaration', () => {
    const state = {
      parent: root,
      name: 'statename',
      views: {
        'header': { component: Cmp },
        'footer': { component: Cmp2 },
      }
    } as any as StateObject;

    const expectedViews = {
      header: {
        $type: 'ng2',
        $name: 'header',
        $uiViewName: 'header',
        $uiViewContextAnchor: '',
        $context: state,
        component: Cmp,
      },
      footer: {
        $type: 'ng2',
        $name: 'footer',
        $uiViewName: 'footer',
        $uiViewContextAnchor: '',
        $context: state,
        component: Cmp2,
      }
    };

    const actual = ng2ViewsBuilder(state);
    expect(actual).toEqual(expectedViews)
  });

  it('should allow shorthand { name: ComponentClass } in views block', () => {
    const state = {
      parent: root,
      name: 'statename',
      views: {
        'header': Cmp,
        'footer': Cmp2,
      }
    } as any as StateObject;

    const expectedViews = {
      header: {
        $type: 'ng2',
        $name: 'header',
        $uiViewName: 'header',
        $uiViewContextAnchor: '',
        $context: state,
        component: Cmp,
      },
      footer: {
        $type: 'ng2',
        $name: 'footer',
        $uiViewName: 'footer',
        $uiViewContextAnchor: '',
        $context: state,
        component: Cmp2,
      }
    };

    const actual = ng2ViewsBuilder(state);
    expect(actual).toEqual(expectedViews)
  });
});
