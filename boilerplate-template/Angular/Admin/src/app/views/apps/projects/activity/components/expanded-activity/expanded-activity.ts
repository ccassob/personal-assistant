import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { expandedActivityData } from '../../data'

@Component({
  selector: 'app-expanded-activity',
  imports: [Icon, RouterLink, CommonModule],
  templateUrl: './expanded-activity.html',
  styles: ``,
})
export class ExpandedActivity {
  expandedActivityData = expandedActivityData
}
