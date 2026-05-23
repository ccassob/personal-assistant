import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { BasicTimeline } from './components/basic-timeline/basic-timeline'
import { BorderTimeline } from './components/border-timeline/border-timeline'
import { IconTimeline } from './components/icon-timeline/icon-timeline'
import { UserTimeline } from './components/user-timeline/user-timeline'

@Component({
  selector: 'app-timeline',
  imports: [PageBreadcrumb, BasicTimeline, IconTimeline, BorderTimeline, UserTimeline],
  templateUrl: './timeline.html',
  styles: ``,
})
export class Timeline {}
