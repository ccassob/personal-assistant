import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { NestedDataType, nestedListWithHandleData } from '../../data'

@Component({
  selector: 'app-sortable-list-handle',
  imports: [DragDropModule, Icon],
  templateUrl: './sortable-list-handle.html',
  styles: ``,
})
export class SortableListHandle {
  tasks: NestedDataType[] = nestedListWithHandleData

  drop(event: CdkDragDrop<NestedDataType[]>, parent?: NestedDataType) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }
  }
}
