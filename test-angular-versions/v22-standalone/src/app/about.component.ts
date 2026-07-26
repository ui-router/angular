import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-about',
  template: ` <p>about works!</p> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class AboutComponent {}
