import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { LayoutService } from '@core/services/layout.service'

import { SearchBox } from './components/search-box'

import { MegamenuHeader } from './components/megamenu-header'

import { MegamenuApps } from './components/megamenu-apps'

import { ThemeToggler } from './components/theme-toggler'

import { LanguageSelector } from './components/language-selector'

import { AppsDropdownRounded } from './components/apps-dropdown-rounded'

import { SimpleMessagesDropdown } from './components/simple-messages-dropdown'

import { FullscreenToggler } from './components/fullscreen-toggler'
import { MonochromeToggler } from './components/monochrome-toggler'
import { NotificationDropdownAlert } from './components/notification-dropdown-alert'

import { CustomizerToggler } from './components/customizer-toggler'
import { MenuToggler } from './components/menu-toggler'
import { SimpleUserDropdown } from './components/simple-user-dropdown'

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, ThemeToggler, LanguageSelector, AppsDropdownRounded, SimpleMessagesDropdown, NotificationDropdownAlert, FullscreenToggler, MonochromeToggler, SimpleUserDropdown, SearchBox, MegamenuHeader, MegamenuApps, CustomizerToggler, MenuToggler],
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

          <search-box />

          <megamenu-header />

          <megamenu-apps />
        </div>

        <div class="d-flex align-items-center gap-2">
          <theme-toggler />

          <apps-dropdown-rounded />

          <simple-messages-dropdown />

          <notification-dropdown-alert />

          <fullscreen-toggler />

          <monochrome-toggler />

          <customizer-toggler />

          <language-selector />

          <simple-user-dropdown />
        </div>
      </div>
    </header>
  `,
})
export class Topbar {
  constructor(public layout: LayoutService) {}
}
