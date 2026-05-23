import { toTitleCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { voteListData } from './data'

@Component({
  selector: 'app-vote-list',
  imports: [PageBreadcrumb, FormsModule, RouterLink, NgbTooltipModule, Icon],
  templateUrl: './vote-list.html',
  styles: ``,
})
export class VoteList {
  voteListData = voteListData

  protected readonly toTitleCase = toTitleCase
}
