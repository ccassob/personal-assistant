import { AsyncPipe } from '@angular/common'
import { Component, inject, TemplateRef } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { attributeData, AttributeType } from './data'

@Component({
  selector: 'app-attributes',
  imports: [PageBreadcrumb, Icon, RouterLink, FormsModule, AsyncPipe, NgbSortableHeader, CustomPagination],
  providers: [TableService],
  templateUrl: './attributes.html',
  styles: ``,
})
export class Attributes {
  attributeData = attributeData
  filterstatus = 'All'
  selectAll = false
  selectedIds = new Set<number>()
  attributeData$: Observable<AttributeType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<AttributeType>) {
    this.attributeData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(attributeData), 8)
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked

    this.selectedIds.clear()

    if (checked) {
      this.attributeData.forEach((_, index) => this.selectedIds.add(index))
    }
  }

  toggleSingleSelection(i: number) {
    if (this.selectedIds.has(i)) {
      this.selectedIds.delete(i)
    } else {
      this.selectedIds.add(i)
    }
    this.selectAll = this.selectedIds.size === this.attributeData.length
  }

  deleteSelected() {
    this.attributeData = this.attributeData.filter((_, index) => !this.selectedIds.has(index))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.attributeData), 8)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }
  private modalService = inject(NgbModal)

  addAttributeModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg', centered: true })
  }
}
