import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { spark1Options, spark2Options, spark3Options, tableChartData } from './data'

@Component({
  selector: 'app-sparklines',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './sparklines.html',
  styles: ``,
})
export class Sparklines {
  spark1Options = spark1Options
  spark2Options = spark2Options
  spark3Options = spark3Options
  tableChartData = tableChartData
}
