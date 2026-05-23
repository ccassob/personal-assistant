import { Component } from '@angular/core'
import { activityData } from '../../data'

@Component({
  selector: 'app-activity',
  imports: [],
  templateUrl: './activity.html',
  styles: ``,
})
export class Activity {
  activityData = activityData
}
