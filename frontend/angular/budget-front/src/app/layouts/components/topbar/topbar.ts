import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'
import { APP_NAME } from '../../../constants'

@Component({
  selector: 'app-topbar',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <header class="app-topbar">
      <div class="container-fluid topbar-menu">
        <div class="d-flex align-items-center gap-2">
          <button class="button-toggle-menu" (click)="layout.toggleMobileMenu()">
            <iconify-icon icon="tabler:menu-2" width="22"></iconify-icon>
          </button>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="nav-link px-2" (click)="layout.toggleTheme()" title="Toggle theme">
            @if (layout.theme === 'light') {
              <iconify-icon icon="tabler:moon" width="20"></iconify-icon>
            } @else {
              <iconify-icon icon="tabler:sun" width="20"></iconify-icon>
            }
          </button>
        </div>
      </div>
    </header>
  `,
})
export class Topbar {
  appName = APP_NAME
  constructor(public layout: LayoutService) {}
}
