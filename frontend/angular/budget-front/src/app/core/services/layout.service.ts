import { DOCUMENT, isPlatformBrowser } from '@angular/common'
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core'
import { ActivatedRoute, CanActivate } from '@angular/router'

const STORAGE_KEY = '__BUDGET_THEME__'

export type LayoutState = {
  theme: string
  sidenavSize: string
}

const INIT_STATE: LayoutState = {
  theme: 'light',
  sidenavSize: 'default',
}

@Injectable({ providedIn: 'root' })
export class LayoutService implements CanActivate {
  private isBrowser: boolean

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: object,
    private activatedRoute: ActivatedRoute
  ) {
    this.isBrowser = isPlatformBrowser(platformId)
    if (this.isBrowser) {
      this.applyAttributes()
    }
  }

  state = signal<LayoutState>(this.loadInitialState())

  canActivate(): boolean {
    this.state.set(this.loadInitialState())
    this.applyAttributes()
    return true
  }

  private loadInitialState(): LayoutState {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : INIT_STATE
    } catch {
      return INIT_STATE
    }
  }

  private persist() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()))
  }

  get theme() { return this.state().theme }
  get sidenavSize() { return this.state().sidenavSize }

  applyAttributes(): void {
    const s = this.state()
    this.document.documentElement.setAttribute('data-bs-theme', s.theme)
    this.document.documentElement.setAttribute('data-sidenav-size', s.sidenavSize)
    this.document.documentElement.setAttribute('data-menu-color', 'dark')
    this.document.documentElement.setAttribute('data-topbar-color', 'light')
    this.document.documentElement.setAttribute('data-layout-position', 'fixed')
    this.document.documentElement.setAttribute('data-layout-width', 'fluid')
    this.document.documentElement.setAttribute('data-skin', 'default')
  }

  updateLayout(newState: Partial<LayoutState>): void {
    this.state.update(s => ({ ...s, ...newState }))
    this.applyAttributes()
    this.persist()
  }

  toggleMobileMenu(): void {
    this.document.documentElement.classList.toggle('sidebar-enable')
    if (this.document.documentElement.classList.contains('sidebar-enable')) {
      this.showBackdrop()
    } else {
      this.hideBackdrop()
    }
  }

  showBackdrop() {
    const backdrop = this.document.createElement('div')
    backdrop.id = 'custom-backdrop'
    backdrop.className = 'offcanvas-backdrop fade show'
    this.document.body.appendChild(backdrop)
    this.document.body.style.overflow = 'hidden'
    backdrop.addEventListener('click', () => {
      this.document.documentElement.classList.remove('sidebar-enable')
      this.hideBackdrop()
    })
  }

  hideBackdrop() {
    const backdrop = this.document.getElementById('custom-backdrop')
    if (backdrop) {
      this.document.body.removeChild(backdrop)
      this.document.body.style.overflow = ''
    }
  }

  toggleTheme(): void {
    const newTheme = this.state().theme === 'light' ? 'dark' : 'light'
    this.updateLayout({ theme: newTheme })
  }
}
