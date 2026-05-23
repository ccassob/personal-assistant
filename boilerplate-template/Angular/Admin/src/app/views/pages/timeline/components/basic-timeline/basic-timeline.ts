import { Component } from '@angular/core'
import { basicTimeline } from '../../data'

@Component({
  selector: 'app-basic-timeline',
  imports: [],
  templateUrl: './basic-timeline.html',
  styles: ``,
})
export class BasicTimeline {
  basicTimeline = basicTimeline
}
