import { toPascalCase } from '@/app/utils/string'
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTableDirective, DataTablesModule } from 'angular-datatables'
import { Config } from 'datatables.net'
import { paginationIcons, tableData } from '../data'

@Component({
  selector: 'app-column-searching',
  imports: [PageBreadcrumb, DataTablesModule, Icon, NgbAlert],
  templateUrl: './column-searching.html',
  styles: ``,
})
export class ColumnSearching implements OnInit, AfterViewInit {
  showAlert = true
  tableData = tableData
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective
  dtOptions: Config = {}
  ngOnInit(): void {
    this.dtOptions = {
      data: tableData.body,
      columns: [
        { data: 'company' },
        { data: 'symbol' },
        {
          data: 'price',
          render: (data: number) => {
            return `${data}`
          },
          className: 'text-start',
        },
        {
          data: 'change',
          render: (data: number) => {
            return `${data}%`
          },
          className: 'text-start',
        },
        { data: 'volume', className: 'text-start' },
        {
          data: 'marketCap',
          render: (data: string) => {
            return `${data}`
          },
        },
        {
          data: 'rating',
          render: (data: number) => {
            return `${data}★`
          },
        },
        {
          data: 'status',
          render: (data: string) => {
            const formattedStatus = toPascalCase(data)
            const badgeClass = formattedStatus === 'Bullish' ? 'success' : 'danger'
            return `<span class="badge badge-label badge-soft-${badgeClass}">${formattedStatus}</span>`
          },
        },
      ],
      orderCellsTop: true,
      language: {
        paginate: paginationIcons,
      },
    }
  }

  ngAfterViewInit(): void {
    this.datatableElement.dtInstance.then((dtInstance) => {
      document.querySelectorAll('#column-search-inputs input').forEach((input, index) => {
        input.addEventListener('keyup', () => {
          const value = (input as HTMLInputElement).value
          dtInstance.column(index).search(value).draw()
        })
      })
    })
  }
  protected readonly toPascalCase = toPascalCase
}
