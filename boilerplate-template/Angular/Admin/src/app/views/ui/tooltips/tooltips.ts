import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { toTitleCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-tooltips',
  imports: [PageBreadcrumb, NgbTooltipModule, Icon, RouterLink],
  templateUrl: './tooltips.html',
  styles: ``,
})
export class Tooltips {
  tooltipVariants = ['primary', 'danger', 'info', 'success', 'secondary', 'warning', 'dark', 'purple']
  protected readonly toTitleCase = toTitleCase
}
