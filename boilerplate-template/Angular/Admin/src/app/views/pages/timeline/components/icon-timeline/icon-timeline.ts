import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { iconTimelineData } from '../../data'

@Component({
  selector: 'app-icon-timeline',
  imports: [Icon, CommonModule],
  templateUrl: './icon-timeline.html',
  styles: ``,
})
export class IconTimeline {
  iconTimelineData = iconTimelineData
}
