import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { commentData } from '../../data'

@Component({
  selector: 'app-comment-card',
  imports: [RouterLink],
  templateUrl: './comment-card.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommentCard {
  commentData = commentData
}
