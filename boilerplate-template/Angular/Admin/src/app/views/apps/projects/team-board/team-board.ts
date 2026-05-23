import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { TeamBoardCard } from './components/team-board-card/team-board-card'
import { teamData } from './data'

@Component({
  selector: 'app-team-board',
  imports: [Icon, RouterLink, TeamBoardCard, PageBreadcrumb],
  templateUrl: './team-board.html',
  styles: ``,
})
export class TeamBoard {
  teamData = teamData
}
