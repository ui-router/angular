import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styles: [
      `.app { text-align: center; border: 1px solid; }`,
      `.active { font-weight: bold; }`
    ],
    standalone: false
})
export class AppComponent {}
