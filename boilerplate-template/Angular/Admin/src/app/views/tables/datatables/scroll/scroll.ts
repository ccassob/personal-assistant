import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTablesModule } from 'angular-datatables'
import { paginationIcons, tableData } from '../data'

@Component({
  selector: 'app-scroll',
  imports: [PageBreadcrumb, NgbAlert, DataTablesModule, Icon],
  templateUrl: './scroll.html',
  styles: ``,
})
export class Scroll {
  showAlert = true
  tableData = tableData

  verticalScrollOptions = {
    paging: false,
    scrollCollapse: true,
    scrollY: '250px',
  }

  horizontalScrollOptions = {
    scrollX: true,
    language: {
      paginate: paginationIcons,
      lengthMenu: '_MENU_ Companies per page',
      info: 'Showing <span class="fw-semibold">_START_</span> to <span class="fw-semibold">_END_</span> of <span class="fw-semibold">_TOTAL_</span> Companies',
    },
  }

  protected readonly toPascalCase = toPascalCase
}
