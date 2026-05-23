import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { SellerContacts } from './components/seller-contacts/seller-contacts'
import { SellerOverview } from './components/seller-overview/seller-overview'
import { SellerTable } from './components/seller-table/seller-table'
import { SellerStatType } from './data'

@Component({
  selector: 'app-seller-details',
  imports: [PageBreadcrumb, SellerContacts, SellerOverview, SellerTable],
  templateUrl: './seller-details.html',
  styles: ``,
})
export class SellerDetails {
  seller!: SellerStatType
}
