import { Component } from '@angular/core'
import { CardWithAction } from '@app/components/card-with-action/card-with-action'
import { Echart } from '@app/components/echart/echart'
import { quarterlyReportData } from '../../data'

@Component({
  selector: 'app-quarterly-reports',
  imports: [CardWithAction, Echart],
  templateUrl: './quarterly-reports.html',
  styles: ``,
})
export class QuarterlyReports {
  quarterlyReportData = quarterlyReportData
}
