import { NgComponentOutlet } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { formStepData } from '../../data'

@Component({
  selector: 'app-basic-wizard',
  imports: [RouterLink, Icon, NgComponentOutlet],
  templateUrl: './basic-wizard.html',
  styles: ``,
})
export class BasicWizard {
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
}
