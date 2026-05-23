import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { BlogType } from '../../data'

@Component({
  selector: 'app-blog-card',
  imports: [RouterLink, Icon],
  templateUrl: './blog-card.html',
  styles: ``,
})
export class BlogCard {
  @Input() blog!: BlogType
}
