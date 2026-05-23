import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { commentData } from '../../data'

@Component({
  selector: 'app-comments',
  imports: [RouterLink, NgbPaginationModule, Icon],
  templateUrl: './comments.html',
  styles: ``,
})
export class Comments {
  page = 1
  commentData = commentData
}
