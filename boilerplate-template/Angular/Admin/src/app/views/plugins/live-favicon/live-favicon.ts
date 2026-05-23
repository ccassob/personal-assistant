import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { FaviconService } from './favicon.service'

@Component({
  selector: 'app-live-favicon',
  imports: [PageBreadcrumb, RouterLink],
  templateUrl: './live-favicon.html',
  styles: ``,
})
export class LiveFavicon {
  private favicon = inject(FaviconService)

  setBadge(count: number | string, color: string) {
    this.favicon.setFaviconWithBadge(count, color, '/favicon.ico')
  }

  ngOnDestroy(): void {
    this.favicon.resetFavicon('/favicon.ico')
  }
}
