import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { ForumPostType } from '../../data'

@Component({
  selector: 'app-forum-post-card',
  imports: [RouterLink, Icon],
  templateUrl: './forum-post-card.html',
  styles: ``,
})
export class ForumPostCard {
  @Input() post!: ForumPostType
}
