import { META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { commentData } from '../../data'
import { FeedCard } from '../feed-card/feed-card'

@Component({
  selector: 'app-feeds',
  imports: [RouterLink, Icon, FeedCard, NgbDropdownModule],
  templateUrl: './feeds.html',
  styles: ``,
})
export class Feeds {
  commentData = commentData
  username = META_DATA.username
}
