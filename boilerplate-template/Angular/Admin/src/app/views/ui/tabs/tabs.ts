import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-tabs',
  imports: [PageBreadcrumb, Icon, NgbNavModule, RouterLink],
  templateUrl: './tabs.html',
  styles: ``,
})
export class Tabs {}
