import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { timelineData } from '../../data'

@Component({
  selector: 'app-project-updates',
  imports: [RouterLink],
  templateUrl: './project-updates.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProjectUpdates {
  timelineData = timelineData
}
