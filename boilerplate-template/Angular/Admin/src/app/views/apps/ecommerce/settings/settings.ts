import { NgComponentOutlet } from '@angular/common'
import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { settingStepData } from './data'

@Component({
  selector: 'app-settings',
  imports: [PageBreadcrumb, Icon, NgComponentOutlet],
  templateUrl: './settings.html',
  styles: ``,
})
export class Settings {
  currentStep = 0
  settingStepData = settingStepData

  goToStep(index: number) {
    this.currentStep = index
  }
  nextStep() {
    if (this.currentStep < this.settingStepData.length - 1) this.currentStep++
  }
  previousStep() {
    if (this.currentStep > 0) this.currentStep--
  }
}
