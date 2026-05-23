import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { taskData } from '../../data'

@Component({
  selector: 'app-task-list',
  imports: [Icon, RouterLink],
  templateUrl: './task-list.html',
  styles: ``,
})
export class TaskList {
  taskData = taskData

  protected readonly toPascalCase = toPascalCase
}
