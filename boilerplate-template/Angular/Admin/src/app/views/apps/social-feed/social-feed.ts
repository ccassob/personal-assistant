import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Activity } from './components/activity/activity'
import { FeaturedVideo } from './components/featured-video/featured-video'
import { Feeds } from './components/feeds/feeds'
import { Requests } from './components/requests/requests'
import { SocialSidebar } from './components/social-sidebar/social-sidebar'
import { Trending } from './components/trending/trending'

@Component({
  selector: 'app-social-feed',
  imports: [PageBreadcrumb, SocialSidebar, Feeds, Activity, Trending, Requests, FeaturedVideo],
  templateUrl: './social-feed.html',
  styles: ``,
})
export class SocialFeed {}
