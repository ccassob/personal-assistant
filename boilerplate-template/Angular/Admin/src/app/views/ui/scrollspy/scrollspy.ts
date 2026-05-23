import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgbDropdownModule, NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-scrollspy',
  imports: [PageBreadcrumb, NgbDropdownModule, NgbScrollSpyModule, Icon, RouterLink],
  templateUrl: './scrollspy.html',
  styles: ``,
})
export class Scrollspy {}
