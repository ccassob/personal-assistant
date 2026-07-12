import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { LayoutService } from '@core/services/layout.service'

import { ThemeToggler } from './components/theme-toggler'
import { FullscreenToggler } from './components/fullscreen-toggler'
import { MonochromeToggler } from './components/monochrome-toggler'
import { CustomizerToggler } from './components/customizer-toggler'
import { MenuToggler } from './components/menu-toggler'
import { SimpleUserDropdown } from './components/simple-user-dropdown'

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, ThemeToggler, FullscreenToggler, MonochromeToggler, SimpleUserDropdown, CustomizerToggler, MenuToggler],
  template: `
    <header class="app-topbar">
      <div class="container-fluid topbar-menu">
        <div class="d-flex align-items-center gap-2">
          <!-- Topbar Brand Logo -->
          <div class="logo-topbar">
            <!-- Logo light -->
            <a routerLink="/" class="logo-light">
              <span class="logo-lg">
                <img src="assets/images/logo.png" alt="logo" />
              </span>
              <span class="logo-sm">
                <img src="assets/images/logo-sm.png" alt="small logo" />
              </span>
            </a>

            <!-- Logo Dark -->
            <a routerLink="/" class="logo-dark">
              <span class="logo-lg">
                <img src="assets/images/logo-black.png" alt="dark logo" />
              </span>
              <span class="logo-sm">
                <img src="assets/images/logo-sm.png" alt="small logo" />
              </span>
            </a>
          </div>

          <menu-toggler />
        </div>

        <div class="d-flex align-items-center gap-2">
          <theme-toggler />
          <fullscreen-toggler />
          <monochrome-toggler />
          <customizer-toggler />
          <simple-user-dropdown />
        </div>
      </div>
    </header>
  `,
})
export class Topbar {
  constructor(public layout: LayoutService) {}
}
