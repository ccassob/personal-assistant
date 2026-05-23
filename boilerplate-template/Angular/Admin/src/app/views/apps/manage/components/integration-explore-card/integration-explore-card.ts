import { toPascalCase } from '@/app/utils/string'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { IntegrationType } from '../../data'

@Component({
  selector: 'app-integration-explore-card',
  imports: [NgbTooltipModule, Icon, RouterLink],
  templateUrl: './integration-explore-card.html',
  styles: ``,
})
export class IntegrationExploreCard {
  @Input() card!: IntegrationType

  protected readonly toPascalCase = toPascalCase
}
