import { CommonModule } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CardWithAction } from '@app/components/card-with-action/card-with-action'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { projectStatusData } from '../../data'
@Component({
  selector: 'app-project-performance',
  imports: [CardWithAction, NgbProgressbar, CommonModule],
  templateUrl: './project-performance.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProjectPerformance {
  projectStatusData = projectStatusData
}
