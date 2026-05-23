import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap'
import { Activity } from './components/activity/activity'
import { Comments } from './components/comments/comments'
import { TaskList } from './components/task-list/task-list'
import { TeamSidebar } from './components/team-sidebar/team-sidebar'

@Component({
  selector: 'app-details',
  imports: [PageBreadcrumb, RouterLink, Comments, TaskList, Activity, NgbNavModule, TeamSidebar, Icon],
  templateUrl: './details.html',
  styles: ``,
})
export class Details {
  active = 1
}
