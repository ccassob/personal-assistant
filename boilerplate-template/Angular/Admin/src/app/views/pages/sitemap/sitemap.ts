import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { sitemapData } from './data'

@Component({
  selector: 'app-sitemap',
  imports: [PageBreadcrumb, Icon, RouterLink, CommonModule],
  templateUrl: './sitemap.html',
  styles: ``,
})
export class Sitemap {
  sitemapData = sitemapData
}
