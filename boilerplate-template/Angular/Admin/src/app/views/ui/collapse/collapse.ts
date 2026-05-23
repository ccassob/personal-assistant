import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-collapse',
  imports: [PageBreadcrumb, NgbCollapseModule, Icon],
  templateUrl: './collapse.html',
  styles: ``,
})
export class Collapse {
  isCollapsed = false
  isHorizontal = true
  isFirstToggle = true
  isSecondToggle = true
}
