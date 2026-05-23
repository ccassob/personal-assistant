import { generateInitials } from '@/app/utils/string'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { meetingData } from '../../data'

@Component({
  selector: 'app-today-schedule',
  imports: [],
  templateUrl: './today-schedule.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TodaySchedule {
  meetingData = meetingData
  protected readonly generateInitials = generateInitials
}
