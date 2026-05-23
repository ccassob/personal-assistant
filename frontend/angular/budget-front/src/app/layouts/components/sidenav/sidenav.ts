import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { menuItems } from '../../../constants'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="sidenav-menu">
      <a routerLink="/dashboard" class="logo">
        <span class="logo-lg">
          <span class="text-primary fw-bold fs-4">Budget</span><span class="fw-light fs-4">App</span>
        </span>
        <span class="logo-sm">
          <span class="text-primary fw-bold">B</span>
        </span>
      </a>

      <div id="sidenav" class="scrollbar" style="overflow-y:auto; height: calc(100vh - 60px);">
        <ul class="side-nav mt-2">
          <li class="side-nav-title">Navigation</li>
          @for (item of menuItems; track item.slug) {
            <li class="side-nav-item" routerLinkActive="active">
              <a [routerLink]="item.url" class="side-nav-link" routerLinkActive="active">
                <span class="menu-icon">
                  <iconify-icon [attr.icon]="item.icon" width="20"></iconify-icon>
                </span>
                <span class="menu-text">{{ item.label }}</span>
              </a>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
})
export class Sidenav {
  menuItems = menuItems
  constructor(public layout: LayoutService) {}
}
