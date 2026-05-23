import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { BasicActivity } from './components/basic-activity/basic-activity'
import { ExpandedActivity } from './components/expanded-activity/expanded-activity'

@Component({
  selector: 'app-activity',
  imports: [PageBreadcrumb, ExpandedActivity, BasicActivity],
  templateUrl: './activity.html',
  styles: ``,
})
export class Activity {}
