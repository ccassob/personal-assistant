import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { basicBox, horizontalBox, scatterBox } from './data'
@Component({
  selector: 'app-boxplot',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './boxplot.html',
  styles: ``,
})
export class Boxplot {
  basicBox = basicBox
  scatterBox = scatterBox
  horizontalBox = horizontalBox
}
