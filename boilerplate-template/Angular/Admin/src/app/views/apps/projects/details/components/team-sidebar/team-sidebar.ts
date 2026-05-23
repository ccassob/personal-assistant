import { formatBytes } from '@/app/utils/string'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { fileData, teamMemberData } from '../../data'

@Component({
  selector: 'app-team-sidebar',
  imports: [RouterLink, Icon],
  templateUrl: './team-sidebar.html',
  styles: ``,
})
export class TeamSidebar {
  teamMemberData = teamMemberData
  fileData = fileData

  protected readonly formatBytes = formatBytes
}
