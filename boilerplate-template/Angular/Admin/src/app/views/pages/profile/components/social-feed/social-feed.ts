import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { socialFeedData } from '../../data'

@Component({
  selector: 'app-social-feed',
  imports: [RouterLink, Icon],
  templateUrl: './social-feed.html',
  styles: ``,
})
export class SocialFeed {
  socialFeedData = socialFeedData
}
