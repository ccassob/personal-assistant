import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { activityData } from '../../data'

@Component({
  selector: 'app-activity',
  imports: [RouterLink, Icon],
  templateUrl: './activity.html',
  styles: ``,
})
export class Activity {
  activityData = activityData
}
