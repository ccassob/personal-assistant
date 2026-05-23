import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { basicSlopeChart, multiSlopeChart } from './data'

@Component({
  selector: 'app-slope',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './slope.html',
  styles: ``,
})
export class Slope {
  basicSlopeChart = basicSlopeChart
  multiSlopeChart = multiSlopeChart
}
