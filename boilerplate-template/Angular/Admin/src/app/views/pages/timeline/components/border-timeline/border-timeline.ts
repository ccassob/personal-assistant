import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { borderTimeline } from '../../data'

@Component({
  selector: 'app-border-timeline',
  imports: [Icon],
  templateUrl: './border-timeline.html',
  styles: ``,
})
export class BorderTimeline {
  borderTimeline = borderTimeline
}
