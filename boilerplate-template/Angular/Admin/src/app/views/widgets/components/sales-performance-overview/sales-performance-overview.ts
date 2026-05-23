import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgbProgressbarModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { salesOverviewData } from '../../data'

@Component({
  selector: 'app-sales-performance-overview',
  imports: [NgbTooltip, NgbProgressbarModule, RouterLink],
  templateUrl: './sales-performance-overview.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SalesPerformanceOverview {
  salesOverviewData = salesOverviewData
}
