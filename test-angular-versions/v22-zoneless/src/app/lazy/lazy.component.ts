import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-lazy',
  template: `
    <p>{{ state.name }} works!</p>
    <ui-view></ui-view>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LazyComponent {
  @Input('$state$') state: any;
}
