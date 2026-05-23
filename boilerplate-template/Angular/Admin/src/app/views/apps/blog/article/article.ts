import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { ArticleSidebar } from './components/article-sidebar/article-sidebar'
import { SocialShare } from './components/social-share/social-share'

@Component({
  selector: 'app-article',
  imports: [PageBreadcrumb, ArticleSidebar, SocialShare, RouterLink, Icon],
  templateUrl: './article.html',
  styles: ``,
})
export class Article {}
