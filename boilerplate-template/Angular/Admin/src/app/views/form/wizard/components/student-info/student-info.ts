import { Component } from '@angular/core'
import { FlatpickrDirective } from 'angularx-flatpickr'

@Component({
  selector: 'app-student-info',
  imports: [FlatpickrDirective],
  templateUrl: './student-info.html',
  styles: ``,
})
export class StudentInfo {
  flatPickrOptions = {
    dateFormat: 'd M, Y',
    defaultDate: new Date(),
    monthSelectorType: 'dropdown' as const,
  }
}
