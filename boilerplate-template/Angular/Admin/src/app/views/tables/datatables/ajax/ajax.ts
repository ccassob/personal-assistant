import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTablesModule } from 'angular-datatables'
import { paginationIcons } from '../data'

@Component({
  selector: 'app-ajax',
  imports: [PageBreadcrumb, DataTablesModule, NgbAlert, Icon],
  templateUrl: './ajax.html',
  styles: ``,
})
export class Ajax {
  showAlert = true
  ajaxDtOptions = {
    ajax: 'assets/data/datatables.json',
    processing: true,
    columns: [
      { data: 'company' },
      { data: 'symbol' },
      { data: 'price' },
      { data: 'change' },
      { data: 'volume' },
      { data: 'market_cap' },
      { data: 'rating' },
      {
        data: 'status',
        render: (data: string) => {
          const isBullish = data === 'Bullish'
          return `<span class="badge badge-label badge-soft-${isBullish ? 'success' : 'danger'}">${data}</span>`
        },
      },
    ],
    language: {
      paginate: paginationIcons,
      lengthMenu: '_MENU_ Companies per page',
      info: 'Showing <span class="fw-semibold">_START_</span> to <span class="fw-semibold">_END_</span> of <span class="fw-semibold">_TOTAL_</span> Companies',
    },
  }
}
