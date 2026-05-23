import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { currentYear } from '@/app/constants'
import { Component } from '@angular/core'

@Component({
  selector: 'app-terms-conditions',
  imports: [PageBreadcrumb],
  templateUrl: './terms-conditions.html',
  styles: ``,
})
export class TermsConditions {
  currentYear = currentYear
}
