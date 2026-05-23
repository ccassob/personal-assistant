import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { meetingData } from '../../../../data'

@Component({
  selector: 'app-today-schedule',
  imports: [RouterLink],
  templateUrl: './today-schedule.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TodaySchedule {
  meetingData = meetingData
}
