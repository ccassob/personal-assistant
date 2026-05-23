import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { bubbleChart, simpleBubbleChart, threedBubbleChart } from './data'

@Component({
  selector: 'app-bubble',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './bubble.html',
  styles: ``,
})
export class Bubble {
  simpleBubbleChart = simpleBubbleChart
  threedBubbleChart = threedBubbleChart
  bubbleChart = bubbleChart
}
