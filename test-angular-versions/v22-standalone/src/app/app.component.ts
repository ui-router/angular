import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AnchorUISref, UISref, UISrefActive, UIView } from '@uirouter/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
      .app {
        text-align: center;
        border: 1px solid;
      }
    `,
    `
      .active {
        font-weight: bold;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [UIView, AnchorUISref, UISref, UISrefActive],
})
export class AppComponent {}
