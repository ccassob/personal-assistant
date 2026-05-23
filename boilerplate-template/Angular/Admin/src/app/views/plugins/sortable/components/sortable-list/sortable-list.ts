import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { Component } from '@angular/core'
import { NestedDataType, nestedListInitialData } from '../../data'

@Component({
  selector: 'app-sortable-list',
  imports: [DragDropModule],
  templateUrl: './sortable-list.html',
  styles: ``,
})
export class SortableList {
  tasks: NestedDataType[] = nestedListInitialData

  drop(event: CdkDragDrop<NestedDataType[]>, parent?: NestedDataType) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }
  }
}
