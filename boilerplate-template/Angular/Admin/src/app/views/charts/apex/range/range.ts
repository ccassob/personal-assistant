import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { basicRangeArea, rangeAreaWithLine } from './data'

@Component({
  selector: 'app-range',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './range.html',
  styles: ``,
})
export class Range {
  basicRangeArea = basicRangeArea
  rangeAreaWithLine = rangeAreaWithLine
}
