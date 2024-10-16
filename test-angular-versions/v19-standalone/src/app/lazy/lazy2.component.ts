import { Component, inject, input } from '@angular/core';
import { Ng2StateDeclaration, UIRouterModule } from '@uirouter/angular';
import { LAZY_PROVIDER_TOKE } from './lazy.module';

@Component({
  selector: 'app-lazy',
  standalone: true,
  imports: [UIRouterModule],
  template: `
    <p>{{ state().name }} works!</p>
    <p>{{ _providedString }}</p>
    <ui-view></ui-view>
  `,
})
export class Lazy2Component {
  state = input.required<Ng2StateDeclaration>({ alias: '$state$' });
  _providedString = inject<string>(LAZY_PROVIDER_TOKE);
}
