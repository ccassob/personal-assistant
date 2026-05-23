import { NgComponentOutlet } from '@angular/common'
import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { OrderSummary } from './components/order-summary/order-summary'
import { checkoutStepsData } from './data'

@Component({
  selector: 'app-checkout',
  imports: [PageBreadcrumb, Icon, OrderSummary, NgComponentOutlet],
  templateUrl: './checkout.html',
  styles: ``,
})
export class Checkout {
  checkoutStepsData = checkoutStepsData
  currentStep = 0
  goToStep(index: number) {
    this.currentStep = index
  }

  nextStep() {
    if (this.currentStep < this.checkoutStepsData.length - 1) this.currentStep++
  }

  previousStep() {
    if (this.currentStep > 0) this.currentStep--
  }
}
