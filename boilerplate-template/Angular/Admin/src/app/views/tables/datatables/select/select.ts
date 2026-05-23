import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTablesModule } from 'angular-datatables'
import { paginationIcons, tableData } from '../data'

@Component({
  selector: 'app-select',
  imports: [PageBreadcrumb, DataTablesModule, Icon, NgbAlert],
  templateUrl: './select.html',
  styles: ``,
})
export class Select {
  basicData = tableData
  showAlert = true

  dtOptions = {
    pageLength: 7,
    lengthMenu: [7, 10, 25, 50, -1],
    select: { style: 'single' } as any,
    language: {
      paginate: paginationIcons,
      lengthMenu: '_MENU_ Companies per page',
    },
  }

  multiDtOptions = {
    pageLength: 7,
    lengthMenu: [7, 10, 25, 50, -1],
    select: { style: 'multi' } as any,
    language: {
      paginate: paginationIcons,
      lengthMenu: '_MENU_ Companies per page',
    },
  }

  cellDtOptions = {
    pageLength: 7,
    lengthMenu: [7, 10, 25, 50, -1],
    select: { style: 'os', items: 'cell' } as any,
    language: {
      paginate: paginationIcons,
      lengthMenu: '_MENU_ Companies per page',
    },
  }

  protected readonly toPascalCase = toPascalCase
}
