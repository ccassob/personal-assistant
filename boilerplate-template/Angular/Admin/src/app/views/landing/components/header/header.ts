import { META_DATA } from '@/app/constants'
import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { LayoutService } from '@core/services/layout.service'
import { ScrollService } from '@core/services/scroll.service'
import { NgbAlert, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-header',
  imports: [RouterLink, NgbCollapseModule, NgbAlert],
  templateUrl: './header.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Header {
  buyUrl = META_DATA.buyUrl
  isCollapsed = true
  isSticky = false
  isOpen = true
  public scroll = inject(ScrollService)
  public layout = inject(LayoutService)

  navItems = ['Home', 'Services', 'Features', 'Plans', 'Reviews', 'Blog', 'Contact']

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scroll = window.scrollY || window.pageYOffset
    this.isSticky = scroll > 100
  }

  closeAlert() {
    this.isOpen = false
  }

  toggleTheme() {
    const newTheme = this.layout.theme === 'light' ? 'dark' : 'light'

    this.layout.updateLayout({
      theme: newTheme,
    })
  }
}
