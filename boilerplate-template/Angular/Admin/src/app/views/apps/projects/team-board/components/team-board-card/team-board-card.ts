import { toPascalCase } from '@/app/utils/string'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { TeamType } from '../../data'

@Component({
  selector: 'app-team-board-card',
  imports: [Icon, RouterLink, NgbProgressbarModule, NgbDropdownModule],
  templateUrl: './team-board-card.html',
  styles: ``,
})
export class TeamBoardCard {
  @Input() team!: TeamType
  @Input() index!: number
  protected readonly toPascalCase = toPascalCase
}
