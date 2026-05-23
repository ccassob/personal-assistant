import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-list-group',
  imports: [PageBreadcrumb, Icon, RouterLink],
  templateUrl: './list-group.html',
  styles: ``,
})
export class ListGroup {}
