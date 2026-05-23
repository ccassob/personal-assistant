import { Component, Input } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { AppType } from '../../data'

@Component({
  selector: 'app-integration-cards',
  imports: [NgbTooltipModule, NgbProgressbarModule, Icon],
  templateUrl: './integration-cards.html',
  styles: ``,
})
export class IntegrationCards {
  @Input() card!: AppType
}
