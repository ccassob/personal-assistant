import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { OrdersCard } from './components/orders-card/orders-card'
import { ProductsCard } from './components/products-card/products-card'
import { ProfitOverviewCard } from './components/profit-overview-card/profit-overview-card'
import { QuarterlyReports } from './components/quarterly-reports/quarterly-reports'
import { StatisticWidgetChartLeft } from './components/statistic-widget-chart-left/statistic-widget-chart-left'
import { StatisticWidgetChartRight } from './components/statistic-widget-chart-right/statistic-widget-chart-right'
import { StatisticWidget } from './components/statistic-widget/statistic-widget'
import { statisticCardData, statisticsData } from './data'

@Component({
  selector: 'app-metrics',
  imports: [PageBreadcrumb, StatisticWidget, StatisticWidgetChartRight, StatisticWidgetChartLeft, QuarterlyReports, ProductsCard, OrdersCard, ProfitOverviewCard],
  templateUrl: './metrics.html',
  styles: ``,
})
export class Metrics {
  statisticCardData = statisticCardData
  statisticsData = statisticsData
}
