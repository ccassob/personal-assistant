import { toPascalCase } from '@/app/utils/string'
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTablesModule } from 'angular-datatables'
import { Subject } from 'rxjs'
import { paginationIcons, tableData } from '../data'

@Component({
  selector: 'app-rows-add',
  imports: [PageBreadcrumb, Icon, DataTablesModule, NgbAlert],
  templateUrl: './rows-add.html',
  styles: ``,
})
export class RowsAdd implements OnInit, AfterViewInit, OnDestroy {
  showAlert = true
  dtOptions: any = {}
  dtTrigger: Subject<any> = new Subject<any>()
  table!: any

  tableData = tableData
  counter = 1

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 5,
      responsive: true,
    }
  }
  ngAfterViewInit(): void {
    this.table = $('#add-rows-data').DataTable({
      language: {
        paginate: paginationIcons,
      },
    })
  }

  addRow(): void {
    const bullish = Math.random() > 0.5

    const newRow = {
      company: `New Company ${this.counter}`,
      symbol: `SYM${this.counter}`,
      price: `$${(Math.random() * 1000 + 1000).toFixed(2)}`,
      change: (Math.random() * 2 * (Math.random() > 0.5 ? 1 : -1)).toFixed(2),
      volume: Math.floor(Math.random() * 1000000).toLocaleString(),
      marketCap: `$${(Math.random() * 100).toFixed(2)}B`,
      rating: `${(Math.random() * 5).toFixed(1)} ★`,
      status: bullish ? 'bullish' : 'bearish',
    }

    const badgeClass = bullish ? 'badge-soft-success' : 'badge-soft-danger'
    const statusLabel = bullish ? 'Bullish' : 'Bearish'

    this.table.row.add([newRow.company, newRow.symbol, newRow.price, newRow.change, newRow.volume, newRow.marketCap, newRow.rating, `<span class="badge badge-label ${badgeClass}">${statusLabel}</span>`]).draw(false)

    this.counter++
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

  protected readonly toPascalCase = toPascalCase
}
