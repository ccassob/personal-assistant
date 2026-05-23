import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { ChatCard } from './components/chat-card/chat-card'
import { CommentCard } from './components/comment-card/comment-card'
import { ContactCard } from './components/contact-card/contact-card'
import { FileManageCard } from './components/file-manage-card/file-manage-card'
import { ProfileCard } from './components/profile-card/profile-card'
import { SalesPerformanceOverview } from './components/sales-performance-overview/sales-performance-overview'
import { StatisticCard1 } from './components/statistic-card1/statistic-card1'
import { StatisticCard2 } from './components/statistic-card2/statistic-card2'
import { StatisticCard3 } from './components/statistic-card3/statistic-card3'
import { StatisticCard4 } from './components/statistic-card4/statistic-card4'
import { StatisticCard5 } from './components/statistic-card5/statistic-card5'
import { StatisticCard6 } from './components/statistic-card6/statistic-card6'
import { TodaySchedule } from './components/today-schedule/today-schedule'
import { TopCountries } from './components/top-countries/top-countries'
import { TrafficSources } from './components/traffic-sources/traffic-sources'
import { statisticCard1Data, statisticCard3Data, statisticCard4Data, statisticCard5Data, statisticCard6Data } from './data'
@Component({
  selector: 'app-widgets',
  imports: [StatisticCard1, PageBreadcrumb, SalesPerformanceOverview, TrafficSources, TopCountries, ProfileCard, CommentCard, ChatCard, ContactCard, FileManageCard, TodaySchedule, StatisticCard2, StatisticCard3, StatisticCard4, StatisticCard5, StatisticCard6],
  templateUrl: './widgets.html',
  styles: ``,
})
export class Widgets {
  statisticCard1Data = statisticCard1Data
  statisticCard3Data = statisticCard3Data
  statisticCard4Data = statisticCard4Data
  statisticCard5Data = statisticCard5Data
  statisticCard6Data = statisticCard6Data
}
