import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-feed-card',
  imports: [Icon, RouterLink, CommonModule, NgbDropdownModule],
  templateUrl: './feed-card.html',
  styles: ``,
})
export class FeedCard {
  @Input({ required: true }) name!: string
  @Input({ required: true }) time!: string
  @Input({ required: true }) avatar!: string
  @Input() description?: string
  @Input() showActions: boolean = true
  @Input() avatarSize: 'sm' | 'md' = 'sm'
  @Input() bodyClass: boolean = true

  @Input() liked: boolean = false

  toggleLike() {
    this.liked = !this.liked
  }
}
