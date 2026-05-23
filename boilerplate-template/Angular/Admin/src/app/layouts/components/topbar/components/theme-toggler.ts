import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'theme-toggler',
  imports: [Icon],
  template: `
    <div class="topbar-item d-none d-sm-flex">
      <button (click)="toggleTheme()" class="topbar-link" type="button">
        @if (layout.theme === 'light') {
          <app-icon icon="moon" class="topbar-link-icon mode-light-moon"></app-icon>
        } @else {
          <app-icon icon="sun" class="topbar-link-icon mode-light-sun"></app-icon>
        }
      </button>
    </div>
  `,
  styles: ``,
})
export class ThemeToggler {
  constructor(public layout: LayoutService) {}

  toggleTheme() {
    if (this.layout.theme === 'light') {
      this.layout.updateLayout({ theme: 'dark' })
    } else {
      this.layout.updateLayout({ theme: 'light' })
    }
  }
}
