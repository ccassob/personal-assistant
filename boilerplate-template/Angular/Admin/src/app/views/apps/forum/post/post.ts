import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { ForumSidebar } from '../components/forum-sidebar/forum-sidebar'
import { PostDetails } from './components/post-details/post-details'

@Component({
  selector: 'app-post',
  imports: [PageBreadcrumb, PostDetails, ForumSidebar],
  templateUrl: './post.html',
  styles: ``,
})
export class Post {}
