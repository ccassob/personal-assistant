import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { PricingCard } from './components/pricing-card/pricing-card'
import { pricingPlanData } from './data'

@Component({
  selector: 'app-pricing',
  imports: [PageBreadcrumb, PricingCard],
  templateUrl: './pricing.html',
  styles: ``,
})
export class Pricing {
  pricingPlanData = pricingPlanData
}
