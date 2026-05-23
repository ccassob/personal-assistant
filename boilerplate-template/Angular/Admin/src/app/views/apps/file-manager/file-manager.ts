import { formatBytes } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component, inject, TemplateRef } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { NgbDropdownModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { SimplebarAngularModule } from 'simplebar-angular'
import { FileSidebar } from './components/file-sidebar/file-sidebar'
import { FolderCard } from './components/folder-card/folder-card'
import { fileRecordData, FileRecordType, folderData } from './data'

@Component({
  selector: 'app-file-manager',
  imports: [PageBreadcrumb, SimplebarAngularModule, FileSidebar, FolderCard, FormsModule, NgbDropdownModule, NgbSortableHeader, AsyncPipe, RouterLink, Icon],
  providers: [TableService],
  templateUrl: './file-manager.html',
  styles: ``,
})
export class FileManager {
  folderData = folderData

  private offcanvasService = inject(NgbOffcanvas)

  fileTypeFilter = ''
  selectAll = false

  openFileSidebar(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { panelClass: 'outlook-left-menu outlook-left-menu-md' })
  }

  fileRecordData$: Observable<FileRecordType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<FileRecordType>) {
    this.fileRecordData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(fileRecordData, 8)
  }

  toggleAllSelection() {
    this.tableService.setAllSelection(this.selectAll)
  }

  toggleSingleSelection(): void {
    this.tableService.items$
      .subscribe((items: FileRecordType[]) => {
        this.selectAll = items.every((item: FileRecordType) => item.selected)
      })
      .unsubscribe()
  }

  deleteSelected() {
    this.tableService.deleteSelectedItems()
    this.selectAll = false
  }

  get hasSelection(): boolean {
    return this.tableService.hasSelectedItems()
  }

  protected readonly formatBytes = formatBytes
}
