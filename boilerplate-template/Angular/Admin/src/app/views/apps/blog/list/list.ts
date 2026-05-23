import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { ListCard } from './components/list-card/list-card'
import { ListSidebar } from './components/list-sidebar/list-sidebar'

@Component({
  selector: 'app-list',
  imports: [PageBreadcrumb, ListCard, ListSidebar],
  templateUrl: './list.html',
  styles: ``,
})
export class List {}
