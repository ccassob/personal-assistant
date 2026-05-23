import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { basicRadialBar, customAngleCircle, gradientCircle, imageFillCircle, multipleRadialBars, semiCircleGauge, strokedGauge } from './data'

@Component({
  selector: 'app-radialbar',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './radialbar.html',
  styles: ``,
})
export class Radialbar {
  basicRadialBar = basicRadialBar
  multipleRadialBars = multipleRadialBars
  customAngleCircle = customAngleCircle
  imageFillCircle = imageFillCircle
  strokedGauge = strokedGauge
  gradientCircle = gradientCircle
  semiCircleGauge = semiCircleGauge
}
