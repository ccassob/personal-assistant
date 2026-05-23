import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { PricingPlanType } from '../../data'

@Component({
  selector: 'app-pricing-plan-card',
  imports: [RouterLink],
  templateUrl: './pricing-plan-card.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PricingPlanCard {
  @Input() plan!: PricingPlanType
}
