import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { AnalyticsOverview } from './components/analytics-overview/analytics-overview'
import { CampaignPerformance } from './components/campaign-performance/campaign-performance'
import { SessionsDevice } from './components/sessions-device/sessions-device'
import { Sidebar } from './components/sidebar/sidebar'
import { TopCountries } from './components/top-countries/top-countries'
import { TrafficSources } from './components/traffic-sources/traffic-sources'

@Component({
  selector: 'app-analytics',
  imports: [PageBreadcrumb, AnalyticsOverview, SessionsDevice, TrafficSources, TopCountries, CampaignPerformance, Sidebar],
  templateUrl: './analytics.html',
  styles: ``,
})
export class Analytics {}
