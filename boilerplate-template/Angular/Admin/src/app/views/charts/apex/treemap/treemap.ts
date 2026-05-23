import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { basicTreemapOptions, colorRangeTreemapOptions, distributedTreemapOptions, multipleSeriesTreemapOptions } from './data'

@Component({
  selector: 'app-treemap',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './treemap.html',
  styles: ``,
})
export class Treemap {
  basicTreemapOptions = basicTreemapOptions
  multipleSeriesTreemapOptions = multipleSeriesTreemapOptions
  distributedTreemapOptions = distributedTreemapOptions
  colorRangeTreemapOptions = colorRangeTreemapOptions
}
