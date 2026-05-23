import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-progress',
  imports: [PageBreadcrumb, Icon, NgbProgressbarModule],
  templateUrl: './progress.html',
  styles: ``,
})
export class Progress {}
