import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { taskData } from '../../data'

@Component({
  selector: 'app-tasks',
  imports: [RouterLink, Icon],
  templateUrl: './tasks.html',
  styles: ``,
})
export class Tasks {
  taskData = taskData
  protected readonly toPascalCase = toPascalCase
}
