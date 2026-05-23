import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { BasicWizard } from './components/basic-wizard/basic-wizard'
import { VerticalWizard } from './components/vertical-wizard/vertical-wizard'
import { WizardWithProgressbar } from './components/wizard-with-progressbar/wizard-with-progressbar'

@Component({
  selector: 'app-wizard',
  imports: [PageBreadcrumb, BasicWizard, WizardWithProgressbar, VerticalWizard],
  templateUrl: './wizard.html',
  styles: ``,
})
export class Wizard {}
