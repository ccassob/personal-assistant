import { NgComponentOutlet } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { formStepData } from '../../data'

@Component({
  selector: 'app-wizard-with-progressbar',
  imports: [NgbProgressbarModule, Icon, RouterLink, NgComponentOutlet],
  templateUrl: './wizard-with-progressbar.html',
  styles: ``,
})
export class WizardWithProgressbar {
  currentStep = 0
  formStepData = formStepData

  goToStep(index: number) {
    this.currentStep = index
  }
  nextStep() {
    if (this.currentStep < this.formStepData.length - 1) this.currentStep++
  }
  previousStep() {
    if (this.currentStep > 0) this.currentStep--
  }

  get progressValue(): number {
    const totalSteps = this.formStepData.length
    return ((this.currentStep + 1) / totalSteps) * 100
  }
}
