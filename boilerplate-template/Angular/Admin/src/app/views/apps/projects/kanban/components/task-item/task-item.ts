import { toPascalCase } from '@/app/utils/string'
import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { KanbanTaskType } from '../../data'

@Component({
  selector: 'app-task-item',
  imports: [Icon, RouterLink, NgbDropdownModule, CommonModule, NgbProgressbar],
  templateUrl: './task-item.html',
  styles: ``,
})
export class TaskItem {
  @Input() item!: KanbanTaskType

  protected readonly toPascalCase = toPascalCase
}
