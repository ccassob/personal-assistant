import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTablesModule } from 'angular-datatables'
import { columns, companies, paginationIcons } from './data'

@Component({
  selector: 'app-fixed-columns',
  imports: [PageBreadcrumb, NgbAlert, DataTablesModule, Icon],
  templateUrl: './fixed-columns.html',
  styles: ``,
})
export class FixedColumns {
  CompanyData = companies
  showAlert = true

  dtOptions = {
    data: companies,
    columns: columns,
    fixedColumns: {
      start: 1,
      end: 1,
    },
    paging: false,
    scrollCollapse: true,
    scrollX: true,
    scrollY: '300px',
    language: {
      paginate: paginationIcons,
    },
  }
}
