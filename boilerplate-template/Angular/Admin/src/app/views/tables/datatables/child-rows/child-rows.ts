import { AfterViewInit, Component, OnDestroy, Renderer2, ViewChild } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTableDirective, DataTablesModule } from 'angular-datatables'
import { Api } from 'datatables.net'
import { CompanyInfoType, paginationIcons } from '../data'

@Component({
  selector: 'app-child-rows',
  imports: [PageBreadcrumb, DataTablesModule, Icon, NgbAlert],
  templateUrl: './child-rows.html',
  styles: ``,
})
export class ChildRows implements AfterViewInit, OnDestroy {
  showAlert = true
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective
  constructor(private renderer: Renderer2) {}
  private unlistenTableClick?: () => void

  childRowOptions = {
    ajax: 'assets/data/datatables.json',
    columns: [
      {
        className: 'dt-control dt-child-rows-btn',
        orderable: false,
        data: null,
        defaultContent:
          '<svg  xmlns="http://www.w3.org/2000/svg"  width="22"  height="22"  viewBox="0 0 24 24"  fill="currentColor"  class="text-primary"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4.929 4.929a10 10 0 1 1 14.141 14.141a10 10 0 0 1 -14.14 -14.14zm8.071 4.071a1 1 0 1 0 -2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0 -2h-2v-2z" /></svg>',
      },
      { data: 'company' },
      { data: 'symbol' },
      { data: 'price' },
      { data: 'change' },
      { data: 'volume' },
      { data: 'market_cap' },
    ],
    language: {
      paginate: paginationIcons,
    },
  }

  ngAfterViewInit(): void {
    this.dtElement.dtInstance.then((dtInstance: Api) => {
      const table = document.getElementById('child-rows-data')
      if (!table) return
      this.unlistenTableClick = this.renderer.listen(table, 'click', (e) => {
        const tr = (e.target as HTMLElement).closest('tr')
        if (!tr) return
        const row = dtInstance.row(tr)
        if (!row || !row.data()) return
        if (row.child.isShown()) {
          row.child.hide()
        } else {
          row.child(this.formatDetails(row.data())).show()
        }
      })
    })
  }

  ngOnDestroy(): void {
    if (this.unlistenTableClick) {
      this.unlistenTableClick()
    }
  }
  formatDetails(d: CompanyInfoType) {
    if (!d) return ''
    return `
          <div class="row align-items-center">
      <div class="col-md-4">
        <h5 class="fs-base mb-1">Rating:</h5>
        <div>${d.rating}</div>
      </div>
      <div class="col-md-4">
        <h5 class="fs-base mb-1">Status:</h5>
        <span class="badge badge-label ${d.status === 'bullish' ? 'badge-soft-success' : 'badge-soft-danger'}">${d.status}</span>
      </div>
      <div class="col-md-4">
        <h5 class="fs-base mb-1">Extra info:</h5>
        <div>And any further details here (images etc)...</div>
      </div>
    </div>
        `
  }
}
