import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTablesModule } from 'angular-datatables'
import { paginationIcons } from '../data'
import { data } from './data'

@Component({
  selector: 'app-javascript',
  imports: [PageBreadcrumb, Icon, NgbAlert, DataTablesModule],
  templateUrl: './javascript.html',
  styles: ``,
})
export class Javascript {
  showAlert = true

  dtOptions = {
    columns: [
      { title: 'company' },
      { title: 'symbol' },
      { title: 'price' },
      { title: 'change' },
      { title: 'volume' },
      { title: 'market_cap' },
      { title: 'rating' },
      {
        title: 'status',
        render: function (data: string) {
          const formattedStatus = toPascalCase(data)
          const badgeClass = formattedStatus === 'Bullish' ? 'badge-soft-success' : 'badge-soft-danger'
          return `<span class="badge badge-label ${badgeClass}">${formattedStatus}</span>`
        },
      },
    ],
    data: data,
    language: {
      paginate: paginationIcons,
      lengthMenu: '_MENU_ Companies per page',
      info: 'Showing <span class="fw-semibold">_START_ </span> to <span class="fw-semibold">_END_</span> of <span class="fw-semibold">_TOTAL_</span> Companies', // Customize the "Showing" text
    },
  }

  protected readonly toPascalCase = toPascalCase
}
