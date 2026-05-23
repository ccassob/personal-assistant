import { Icon } from '@/app/components/icon/icon'
import { Rating } from '@/app/components/rating/rating'
import { TableService } from '@/app/core/services/table.service'
import { toPascalCase } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Observable } from 'rxjs'
import { customTableData, CustomTableType } from '../../data'

@Component({
  selector: 'app-table-with-search',
  imports: [RouterLink, Rating, AsyncPipe, FormsModule, Icon],
  providers: [TableService],
  templateUrl: './table-with-search.html',
  styles: ``,
})
export class TableWithSearch {
  customTableData$: Observable<CustomTableType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<CustomTableType>) {
    this.customTableData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(customTableData, 5)
  }

  protected readonly toPascalCase = toPascalCase
}
