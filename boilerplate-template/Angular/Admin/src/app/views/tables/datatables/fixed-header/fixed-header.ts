import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTablesModule } from 'angular-datatables'
import { paginationIcons, tableData } from '../data'

@Component({
  selector: 'app-fixed-header',
  imports: [PageBreadcrumb, Icon, DataTablesModule, NgbAlert],
  templateUrl: './fixed-header.html',
  styles: ``,
})
export class FixedHeader {
  showAlert = true
  tableData = tableData

  fixedColumnDtOptions = {
    fixedHeader: {
      header: true,
      headerOffset: 65,
    },
    pageLength: 25,
    language: {
      paginate: paginationIcons,
    },
  }

  protected readonly toPascalCase = toPascalCase
}
