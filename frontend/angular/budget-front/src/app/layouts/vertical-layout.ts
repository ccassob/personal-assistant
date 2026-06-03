import { Component, OnDestroy, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { LayoutService } from '@core/services/layout.service'
import { ConnectivityService } from '@core/services/connectivity.service'
import { Footer } from '@layouts/components/footer/footer'
import { Sidenav } from '@layouts/components/sidenav/sidenav'
import { Topbar } from '@layouts/components/topbar/topbar'
import { debounceTime, fromEvent, Subscription } from 'rxjs'

@Component({
  selector: 'app-vertical-layout',
  imports: [RouterOutlet, Sidenav, Topbar, Footer],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @if (!connectivity.isOnline()) {
      <div class="offline-banner">
        <iconify-icon icon="tabler:wifi-off" width="16" style="margin-right:6px"></iconify-icon>
        No connection — API server is unreachable
      </div>
    }
    <div class="wrapper">
      <app-sidenav />
      <app-topbar />
      <div class="content-page">
        <router-outlet />
        <app-footer />
      </div>
    </div>
  `,
  styles: [`
    .offline-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: #dc3545;
      color: #fff;
      text-align: center;
      padding: 6px 16px;
      font-size: 0.875rem;
      font-weight: 500;
    }
  `],
})
export class VerticalLayout implements OnInit, OnDestroy {
  constructor(public layout: LayoutService, public connectivity: ConnectivityService) {}
  private resizeSub!: Subscription

  ngOnInit() {
    this.onResize()
    this.resizeSub = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.onResize())
  }

  onResize(): void {
    const w = window.innerWidth
    if (w <= 767.98) {
      this.layout.updateLayout({ sidenavSize: 'offcanvas' })
    } else if (w <= 1140) {
      this.layout.updateLayout({ sidenavSize: 'condensed' })
    } else {
      this.layout.updateLayout({ sidenavSize: 'default' })
    }
  }

  ngOnDestroy(): void {
    this.resizeSub?.unsubscribe()
  }
}
