import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { basicScatter, datetimeScatter, scatterImages } from './data'

@Component({
  selector: 'app-scatter',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './scatter.html',
  styles: ``,
})
export class Scatter {
  basicScatter = basicScatter
  datetimeScatter = datetimeScatter
  scatterImages = scatterImages
}
