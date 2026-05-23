import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap'
import { CompanyCard } from './components/company-card/company-card'
import { companyData } from './data'

@Component({
  selector: 'app-companies',
  imports: [PageBreadcrumb, Icon, CompanyCard, NgbPagination],
  templateUrl: './companies.html',
  styles: ``,
})
export class Companies {
  companyData = companyData
}
