import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { advancedTimelineOptions, basicTimelineOptions, distributedTimelineOptions, groupRowsTimelineOptions, multiSeriesTimelineOptions } from './data'

@Component({
  selector: 'app-timeline',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './timeline.html',
  styles: ``,
})
export class Timeline {
  basicTimelineOptions = basicTimelineOptions
  distributedTimelineOptions = distributedTimelineOptions
  multiSeriesTimelineOptions = multiSeriesTimelineOptions
  advancedTimelineOptions = advancedTimelineOptions
  groupRowsTimelineOptions = groupRowsTimelineOptions
}
