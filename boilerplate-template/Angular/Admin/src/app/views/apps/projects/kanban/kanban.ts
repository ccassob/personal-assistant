import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { SimplebarAngularModule } from 'simplebar-angular'
import { TaskItem } from './components/task-item/task-item'
import { kanbanTaskData, KanbanTaskType } from './data'

@Component({
  selector: 'app-kanban',
  imports: [PageBreadcrumb, Icon, RouterLink, CdkDropListGroup, CdkDropList, CdkDrag, SimplebarAngularModule, TaskItem],
  templateUrl: './kanban.html',
  styles: ``,
})
export class Kanban {
  todoTasks: KanbanTaskType[] = []
  inprogressTasks: KanbanTaskType[] = []
  inreviewTasks: KanbanTaskType[] = []
  completedTasks: KanbanTaskType[] = []

  kanbanTaskData = kanbanTaskData

  flatPickrOptions = {
    dateFormat: 'd M, Y',
    defaultDate: new Date(),
    monthSelectorType: 'dropdown' as const,
  }

  ngOnInit(): void {
    this.todoTasks = this.kanbanTaskData.filter((t) => t.status === 'todo')
    this.inprogressTasks = this.kanbanTaskData.filter((t) => t.status === 'in-progress')
    this.inreviewTasks = this.kanbanTaskData.filter((t) => t.status === 'in-review')
    this.completedTasks = this.kanbanTaskData.filter((t) => t.status === 'done')
  }

  drop(event: CdkDragDrop<KanbanTaskType[], any, any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }
  }
}
