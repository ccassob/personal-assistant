import { AsyncPipe, DecimalPipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CardWithAction } from '@app/components/card-with-action/card-with-action'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { Observable } from 'rxjs'
import { campaignData, CampaignType } from '../../data'

@Component({
  selector: 'app-campaign-performance',
  imports: [CardWithAction, NgbSortableHeader, AsyncPipe, DecimalPipe, CustomPagination],
  providers: [TableService],
  templateUrl: './campaign-performance.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CampaignPerformance {
  campaignData$: Observable<CampaignType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<CampaignType>) {
    this.campaignData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(campaignData, 5)
  }
}
