import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home',
  template: ` <p>home works!</p> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class HomeComponent {}
