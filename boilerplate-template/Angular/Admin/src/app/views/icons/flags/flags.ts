import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { NgbSortableHeader } from '@/app/core/directive/sortable.directive'
import { TableService } from '@/app/core/services/table.service'
import { AsyncPipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { countryData, CountryType } from './data'

@Component({
  selector: 'app-flags',
  imports: [PageBreadcrumb, AsyncPipe, FormsModule, NgbSortableHeader, NgbPaginationModule, Icon],
  providers: [TableService],
  templateUrl: './flags.html',
  styles: ``,
})
export class Flags implements OnInit {
  countryData$: Observable<CountryType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<CountryType>) {
    this.countryData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(countryData, 50)
  }
}
