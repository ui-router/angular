import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lazy',
  template: `
    <p>{{state.name}} works!</p>
    <ui-view></ui-view>
  `,
})
export class LazyComponent {
  @Input('$state$') state;
}
