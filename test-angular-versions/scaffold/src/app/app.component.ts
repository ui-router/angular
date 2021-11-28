import { Component } from '@angular/core';

const template = `
<ui-view name="header" id="header"></ui-view>

<div class="app">
  <img width="300" alt="Angular Logo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==">

  <div>

    <a uiSref="home" uiSrefActive="active">home</a>
    <a uiSref="about" uiSrefActive="active">about</a>
    <a uiSref="lazy" uiSrefActiveEq="active">lazy</a>
    <a uiSref="lazy.child" uiSrefActive="active">lazy.child</a>
    <a uiSref="lazy.child.viewtarget" uiSrefActive="active">lazy.child.viewtarget</a>
  </div>

  <ui-view id="default"></ui-view>
</div>

<ui-view name="footer" id="footer"></ui-view>
`;

@Component({
  selector: 'app-root',
  template: template,
  styles: [
    `
      .app {
        text-align: center;
        border: 1px solid;
      }

      .active {
        font-weight: bold;
      }
    `,
  ],
})
export class AppComponent {}
