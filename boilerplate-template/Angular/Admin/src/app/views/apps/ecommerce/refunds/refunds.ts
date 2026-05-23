import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { RefundsTable } from './components/refunds-table/refunds-table'
import { RefundsWidget } from './components/refunds-widget/refunds-widget'
import { refundStatData } from './data'

@Component({
  selector: 'app-refunds',
  imports: [PageBreadcrumb, RefundsWidget, RefundsTable],
  templateUrl: './refunds.html',
  styles: ``,
})
export class Refunds {
  refundStatData = refundStatData
}
