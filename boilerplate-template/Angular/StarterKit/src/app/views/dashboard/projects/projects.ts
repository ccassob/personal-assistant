import { Component } from '@angular/core'
import { Discussions } from './components/discussions/discussions'
import { Messages } from './components/messages/messages'
import { ProjectPerformance } from './components/project-performance/project-performance'
import { ProjectProgressChart } from './components/project-progress-chart/project-progress-chart'
import { ProjectUpdates } from './components/project-updates/project-updates'
import { QuarterlyReports } from './components/quarterly-reports/quarterly-reports'
import { RevenueChart } from './components/revenue-chart/revenue-chart'
import { StatisticCard } from './components/statistic-card/statistic-card'
import { statisticData } from './data'

@Component({
  selector: 'app-projects',
  imports: [Messages, RevenueChart, ProjectProgressChart, StatisticCard, QuarterlyReports, ProjectPerformance, ProjectUpdates, Discussions],
  templateUrl: './projects.html',
  styles: ``,
})
export class Projects {
  statisticData = statisticData
}
