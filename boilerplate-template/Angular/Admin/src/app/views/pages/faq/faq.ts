import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Customization } from './components/customization/customization'
import { General } from './components/general/general'
import { Payments } from './components/payments/payments'
import { Refunds } from './components/refunds/refunds'

@Component({
  selector: 'app-faq',
  imports: [PageBreadcrumb, RouterLink, Icon, General, Payments, Refunds, Customization],
  templateUrl: './faq.html',
  styles: ``,
})
export class Faq {
  popularSearch = ['Apps', 'Developers', 'Repair', 'Billing']
}
