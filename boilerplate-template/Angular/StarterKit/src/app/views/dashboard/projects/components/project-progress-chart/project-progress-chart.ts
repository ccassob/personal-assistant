import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { projectProgressChartOptions } from '../../data'

@Component({
  selector: 'app-project-progress-chart',
  imports: [Echart],
  templateUrl: './project-progress-chart.html',
  styles: ``,
})
export class ProjectProgressChart {
  projectProgressChartOptions = projectProgressChartOptions
}
