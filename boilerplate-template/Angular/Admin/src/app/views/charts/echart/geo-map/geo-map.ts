import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { MorphingMapBar } from './components/morphing-map-bar/morphing-map-bar'
import { PieChartWithMap } from './components/pie-chart-with-map/pie-chart-with-map'
import { SvgScatterMap } from './components/svg-scatter-map/svg-scatter-map'
import { UsaMap } from './components/usa-map/usa-map'
import { WorldMap } from './components/world-map/world-map'

@Component({
  selector: 'app-geo-map',
  imports: [PageBreadcrumb, UsaMap, MorphingMapBar, PieChartWithMap, SvgScatterMap, WorldMap],
  templateUrl: './geo-map.html',
  styles: ``,
})
export class GeoMap {}
