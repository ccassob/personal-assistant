import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { IntegrationCards } from './components/integration-cards/integration-cards'
import { IntegrationExploreCard } from './components/integration-explore-card/integration-explore-card'
import { authorizedAppData, integrationData } from './data'

@Component({
  selector: 'app-manage',
  imports: [PageBreadcrumb, RouterLink, IntegrationCards, IntegrationExploreCard, NgbPaginationModule, Icon],
  templateUrl: './manage.html',
  styles: ``,
})
export class Manage {
  authorizedAppData = authorizedAppData
  integrationData = integrationData
}
