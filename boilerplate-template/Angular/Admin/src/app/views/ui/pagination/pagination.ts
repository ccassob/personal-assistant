import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-pagination',
  imports: [PageBreadcrumb, Icon, NgbPaginationModule],
  templateUrl: './pagination.html',
  styles: ``,
})
export class Pagination {}
