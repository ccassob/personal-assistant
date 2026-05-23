import { toTitleCase } from '@/app/utils/string'
import { CommonModule, DecimalPipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { TableService } from '@core/services/table.service'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { issueData, IssueType } from './data'

@Component({
  selector: 'app-issue-tracker',
  imports: [PageBreadcrumb, NgbProgressbarModule, FormsModule, CommonModule, CustomPagination, RouterLink, Icon],
  providers: [TableService],
  templateUrl: './issue-tracker.html',
  styles: ``,
})
export class IssueTracker {
  issueData = issueData

  public tableService = inject(TableService<IssueType>)
  issueData$: Observable<IssueType[]>
  total$: Observable<number>

  constructor(public pipe: DecimalPipe) {
    this.issueData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(this.issueData, 8)
  }

  protected readonly toTitleCase = toTitleCase
}
