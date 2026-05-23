import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-colors',
  imports: [PageBreadcrumb, RouterLink, Icon],
  templateUrl: './colors.html',
  styles: ``,
})
export class Colors {}
