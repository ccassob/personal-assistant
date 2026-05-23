import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { ForumSidebar } from '../components/forum-sidebar/forum-sidebar'
import { ForumPostCard } from './components/forum-post-card/forum-post-card'
import { forumPostData } from './data'

@Component({
  selector: 'app-view',
  imports: [PageBreadcrumb, ForumPostCard, NgbPaginationModule, Icon, ForumSidebar],
  templateUrl: './view.html',
  styles: ``,
})
export class View {
  page = 2
  forumPostData = forumPostData
}
