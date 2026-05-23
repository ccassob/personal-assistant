import { toPascalCase } from '@/app/utils/string'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { ProjectType } from '../../data'

@Component({
  selector: 'app-project-card',
  imports: [Icon, RouterLink, NgbDropdownModule, NgbProgressbar],
  templateUrl: './project-card.html',
  styles: ``,
})
export class ProjectCard {
  @Input() project!: ProjectType
  protected readonly toPascalCase = toPascalCase
}
