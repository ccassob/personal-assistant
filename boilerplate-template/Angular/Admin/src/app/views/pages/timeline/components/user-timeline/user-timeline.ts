import { Component } from '@angular/core'
import { userTimeline } from '../../data'

@Component({
  selector: 'app-user-timeline',
  imports: [],
  templateUrl: './user-timeline.html',
  styles: ``,
})
export class UserTimeline {
  userTimeline = userTimeline
}
