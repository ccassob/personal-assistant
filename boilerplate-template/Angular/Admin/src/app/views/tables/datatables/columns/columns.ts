import { toPascalCase } from '@/app/utils/string'
import { Component, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { DataTableDirective, DataTablesModule } from 'angular-datatables'
import { Api } from 'datatables.net'
import { Subject } from 'rxjs'
import { paginationIcons, tableData } from '../data'

@Component({
  selector: 'app-columns',
  imports: [PageBreadcrumb, Icon, DataTablesModule, NgbDropdownModule, FormsModule, NgbAlert],
  templateUrl: './columns.html',
  styles: ``,
})
export class Columns {
  showAlert = true
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective
  dtTrigger: Subject<any> = new Subject()
  tableData = tableData

  columnLabels = ['Company', 'Symbol', 'Price', 'Change', 'Volume', 'Market Cap', 'Rating', 'Status']
  columnVisibility = [true, true, true, true, true, true, true, true]
  columnsOptions = {
    responsive: true,
    dom: "<'d-flex justify-content-between align-items-start mb-3'<'column-btn'>f>rt<'d-flex justify-content-between align-items-center mt-2'lp>",
    language: {
      paginate: paginationIcons,
    },
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next({})
  }

  toggleColumn(colIdx: number, visible: boolean) {
    this.columnVisibility[colIdx] = visible

    this.dtElement.dtInstance.then((dtInstance: Api) => {
      dtInstance.column(colIdx).visible(visible)
    })
  }

  protected readonly toPascalCase = toPascalCase
}
