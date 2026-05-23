import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { BlogType } from '../../data'

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, Icon],
  templateUrl: './blog-post.html',
  styles: ``,
})
export class BlogPost {
  @Input() blog!: BlogType
}
