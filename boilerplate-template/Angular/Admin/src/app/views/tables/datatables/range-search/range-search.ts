import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTablesModule } from 'angular-datatables'
import { Config } from 'datatables.net'
import { paginationIcons, tableData } from '../data'

@Component({
  selector: 'app-range-search',
  imports: [PageBreadcrumb, Icon, DataTablesModule, FormsModule, NgbAlert],
  templateUrl: './range-search.html',
  styles: ``,
})
export class RangeSearch {
  showAlert = true
  dtOptions: Config = {}
  tableData = tableData
  minPrice: number | '' = ''
  maxPrice: number | '' = ''

  ngOnInit(): void {
    this.initializeDataTable()
  }

  initializeDataTable() {
    const self = this

    $.fn.dataTable.ext.search.push(function (settings: any, data: any) {
      if (settings.nTable.id !== 'range-search-data') return true

      const min = parseFloat(self.minPrice as any) || NaN
      const max = parseFloat(self.maxPrice as any) || NaN

      const priceStr = (data[2] || '').replace(/[^0-9.]/g, '')
      const price = parseFloat(priceStr) || 0

      return (isNaN(min) && isNaN(max)) || (isNaN(min) && price <= max) || (min <= price && isNaN(max)) || (min <= price && price <= max)
    })

    this.dtOptions = {
      data: tableData.body,
      columns: [
        { title: 'Company', data: 'company' },
        { title: 'Symbol', data: 'symbol' },
        {
          title: 'Price',
          data: 'price',
          render: (data: number) => {
            return `${data}`
          },
        },
        {
          title: 'Change',
          data: 'change',
          render: (data: number) => {
            return `${data}%`
          },
        },
        { title: 'Volume', data: 'volume' },
        {
          title: 'Market Cap',
          data: 'marketCap',
          render: (data: string) => {
            return `${data}`
          },
        },
        {
          title: 'Rating',
          data: 'rating',
          render: (data: number) => {
            return `${data}★`
          },
        },
        {
          title: 'Status',
          data: 'status',
          render: (data: string) => {
            const type = data === 'bullish' ? 'success' : 'danger'
            return `<span class="badge badge-soft-${type}">${toPascalCase(data)}</span>`
          },
        },
      ],
      language: {
        paginate: paginationIcons,
      },
      dom: "<'d-md-flex justify-content-between align-items-center my-2 mb-4'<'filter-range me-2'>f>" + 'rt' + "<'d-md-flex justify-content-between align-items-center mt-2 mb-2'ip>",
    }
  }

  onRangeChange() {
    $('#range-search-data').DataTable().draw()
  }
}
