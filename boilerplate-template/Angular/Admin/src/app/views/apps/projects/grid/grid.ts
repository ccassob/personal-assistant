import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbDropdownModule, NgbPaginationModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { ProjectCard } from './components/project-card/project-card'
import { ProjectCard2 } from './components/project-card2/project-card2'
import { projectData } from './data'

@Component({
  selector: 'app-grid',
  imports: [Icon, NgbProgressbarModule, NgbDropdownModule, RouterLink, PageBreadcrumb, NgbPaginationModule, ProjectCard, ProjectCard2],
  templateUrl: './grid.html',
  styles: ``,
})
export class Grid {
  projectData = projectData
  page = 1

  protected readonly toPascalCase = toPascalCase
}
