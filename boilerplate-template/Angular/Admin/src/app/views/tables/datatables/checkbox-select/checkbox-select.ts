import { toPascalCase } from '@/app/utils/string'
import { Component, OnInit } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTablesModule } from 'angular-datatables'
import DataTable from 'datatables.net-bs5'
import Select from 'datatables.net-select'
import { paginationIcons, tableData } from '../data'

@Component({
  selector: 'app-checkbox-select',
  imports: [PageBreadcrumb, Icon, DataTablesModule, NgbAlert],
  templateUrl: './checkbox-select.html',
  styles: ``,
})
export class CheckboxSelect implements OnInit {
  showAlert = true
  dtOptions: any = {}
  rows = tableData

  ngOnInit(): void {
    DataTable.use(Select)

    this.dtOptions = {
      data: this.rows.body,
      columns: [
        {
          data: null,
          orderable: false,
          className: 'text-center',
          targets: 0,
          title: `
            <input type="checkbox" class="dt-select-checkbox form-check-input fs-14" id="select-all" />
          `,
          render: () => `<input type="checkbox" class="dt-select-checkbox form-check-input row-checkbox fs-14"/>`,
        },
        { data: 'company' },
        { data: 'symbol' },
        { data: 'price' },
        { data: 'change' },
        { data: 'volume' },
        { data: 'marketCap' },
        {
          data: 'rating',
          render: (data: number) => {
            return `${data}★`
          },
        },
        {
          data: 'status',
          render: (data: string) => {
            const badgeClass = data === 'bullish' ? 'success' : 'danger'
            return `<span class="badge badge-label badge-soft-${badgeClass}">${toPascalCase(data)}</span>`
          },
        },
      ],

      select: {
        style: 'multi',
        selector: 'td:first-child input[type="checkbox"]',
      },

      language: {
        paginate: paginationIcons,
      },
      drawCallback: function () {
        const api = this.api()
        $('#select-all')
          .off('click')
          .on('click', function (this: HTMLInputElement) {
            if (this.checked) {
              api.rows({ page: 'current' }).select()
              $('.row-checkbox').prop('checked', true)
            } else {
              api.rows().deselect()
              $('.row-checkbox').prop('checked', false)
            }
          })
      },
    }
  }
}
