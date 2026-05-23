import { toPascalCase } from '@/app/utils/string'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { ProjectType } from '../../data'
@Component({
  selector: 'app-project-card2',
  imports: [Icon, RouterLink, NgbProgressbar, NgbDropdownModule],
  templateUrl: './project-card2.html',
  styles: ``,
})
export class ProjectCard2 {
  @Input() project!: ProjectType
  protected readonly toPascalCase = toPascalCase
}
