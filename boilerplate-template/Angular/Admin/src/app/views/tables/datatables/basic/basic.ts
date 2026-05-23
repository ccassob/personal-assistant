import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTablesModule } from 'angular-datatables'
import { paginationIcons, tableData } from '../data'

@Component({
  selector: 'app-basic',
  imports: [PageBreadcrumb, Icon, DataTablesModule, NgbAlert],
  templateUrl: './basic.html',
  styles: ``,
})
export class Basic {
  basicData = tableData
  showAlert = true

  dtOptions = {
    language: {
      paginate: paginationIcons,
    },
  }
  protected readonly toPascalCase = toPascalCase
}
