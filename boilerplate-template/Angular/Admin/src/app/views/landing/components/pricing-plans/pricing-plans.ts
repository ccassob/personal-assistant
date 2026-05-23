import { Component } from '@angular/core'
import { pricingData } from '../../data'
import { PricingPlanCard } from '../pricing-plan-card/pricing-plan-card'

@Component({
  selector: 'app-pricing-plans',
  imports: [PricingPlanCard],
  templateUrl: './pricing-plans.html',
  styles: ``,
})
export class PricingPlans {
  pricingData = pricingData
}
