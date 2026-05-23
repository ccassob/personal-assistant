import { Icon } from '@/app/components/icon/icon'
import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { PlanType } from '../../data'

@Component({
  selector: 'app-pricing-card',
  imports: [Icon, RouterLink, CommonModule],
  templateUrl: './pricing-card.html',
  styles: ``,
})
export class PricingCard {
  @Input() plan!: PlanType
}
