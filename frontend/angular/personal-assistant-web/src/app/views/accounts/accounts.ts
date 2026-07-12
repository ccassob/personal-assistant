import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DecimalPipe } from '@angular/common'
import { NgApexchartsModule } from 'ng-apexcharts'
import {
  ApexChart, ApexAxisChartSeries, ApexXAxis,
  ApexFill, ApexStroke, ApexDataLabels, ApexTooltip, ApexYAxis
} from 'ng-apexcharts'
import { Account, AccountHistory, AccountHistoryTotal, AccountService } from '../../core/services/api/account.service'

@Component({
  selector: 'app-accounts',
  imports: [FormsModule, DecimalPipe, NgApexchartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Accounts</h4>
            <button class="btn btn-primary" (click)="openForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Account
            </button>
          </div>
        </div>
      </div>

      <!-- Balance banners — always visible -->
      <div class="row mb-3 g-3">
        <div class="col-sm-6">
          <div class="card bg-primary text-white h-100">
            <div class="card-body py-3 d-flex align-items-center justify-content-between">
              <div>
                <div class="small opacity-75 mb-1">Total Available</div>
                <div class="fw-bold" style="font-size:1.6rem">{{ totalRegular | number:'1.2-2' }}</div>
              </div>
              <iconify-icon icon="tabler:wallet" width="40" style="opacity:0.4"></iconify-icon>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card text-white h-100" style="background:#0d9488">
            <div class="card-body py-3 d-flex align-items-center justify-content-between">
              <div>
                <div class="small opacity-75 mb-1">Total Invested</div>
                <div class="fw-bold" style="font-size:1.6rem">{{ totalInvestment | number:'1.2-2' }}</div>
              </div>
              <iconify-icon icon="tabler:chart-candle" width="40" style="opacity:0.4"></iconify-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Portfolio chart — hidden on mobile -->
      <div class="row mb-3 d-none d-md-flex">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title mb-3">
                <iconify-icon icon="tabler:chart-area-line" width="18" class="me-1"></iconify-icon>
                Total Portfolio — Last 6 Months
              </h6>
              @if (totalHistory.length > 0) {
                <apx-chart
                  [series]="chartSeries"
                  [chart]="chartOptions"
                  [xaxis]="chartXAxis"
                  [yaxis]="totalChartYAxis"
                  [fill]="chartFill"
                  [stroke]="chartStroke"
                  [dataLabels]="chartDataLabels"
                  [tooltip]="chartTooltip"
                  [colors]="totalChartColors"
                ></apx-chart>
              } @else {
                <p class="text-muted text-center py-3 mb-0">No history yet. Save an account to start tracking.</p>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Account card grid — responsive on all sizes -->
      @if (items.length === 0) {
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body text-center text-muted py-5">No accounts found.</div>
            </div>
          </div>
        </div>
      }
      <div class="row g-3">
        @for (a of items; track a.id) {
          <div class="col-12 col-sm-6 col-xl-4">
            <div class="card h-100 account-card"
                 [class.border-primary]="selectedAccount?.id === a.id && a.accountType !== 'Investment'"
                 [style.border-left]="a.accountType === 'Investment' ? '4px solid #0d9488' : ''"
                 style="cursor:pointer; transition: border-color .15s"
                 (click)="selectAccount(a)">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="d-flex align-items-center gap-2 text-truncate me-2">
                    <span class="fw-semibold fs-6">{{ a.name }}</span>
                    @if (a.accountType === 'Investment') {
                      <span class="badge" style="background:#0d9488;font-size:0.65rem">Investment</span>
                    }
                  </div>
                  <iconify-icon icon="tabler:chevron-right" width="16" class="text-muted flex-shrink-0 d-md-none mt-1"></iconify-icon>
                </div>
                <div class="fw-bold mb-1" style="font-size:1.4rem" [class.text-success]="a.amount >= 0" [class.text-danger]="a.amount < 0">
                  {{ a.amount | number:'1.2-2' }}
                </div>
                <div class="text-muted small mb-3">Updated {{ a.lastModified }}</div>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-primary flex-grow-1" (click)="openForm(a); $event.stopPropagation()">
                    <iconify-icon icon="tabler:edit" width="14"></iconify-icon> Edit
                  </button>
                  <button class="btn btn-sm btn-outline-danger" (click)="delete(a.id); $event.stopPropagation()">
                    <iconify-icon icon="tabler:trash" width="14"></iconify-icon> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Per-account history chart — hidden on mobile, shown on tap/click -->
      @if (selectedAccount) {
        <div class="row mt-3 d-none d-md-flex">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title mb-3">
                  <iconify-icon icon="tabler:chart-line" width="18" class="me-1"></iconify-icon>
                  {{ selectedAccount.name }} — Last 6 Months
                </h6>
                @if (accountHistory.length > 0) {
                  <apx-chart
                    [series]="accountChartSeries"
                    [chart]="chartOptions"
                    [xaxis]="accountChartXAxis"
                    [yaxis]="chartYAxis"
                    [fill]="chartFill"
                    [stroke]="chartStroke"
                    [dataLabels]="chartDataLabels"
                    [tooltip]="chartTooltip"
                  ></apx-chart>
                } @else {
                  <p class="text-muted text-center py-3 mb-0">No history yet for <strong>{{ selectedAccount.name }}</strong>. Save it to start tracking.</p>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>

    @if (showModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ form.id ? 'Edit' : 'Add' }} Account</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Account Name</label>
                <input class="form-control" [(ngModel)]="form.name">
              </div>
              <div class="mb-3">
                <label class="form-label">Account Type</label>
                <select class="form-select" [(ngModel)]="form.accountType">
                  <option value="Regular">Regular</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Amount</label>
                <input type="number" class="form-control" [(ngModel)]="form.amount" step="0.01">
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeForm()">Cancel</button>
              <button class="btn btn-primary" (click)="save()">Save</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class Accounts implements OnInit {
  items: Account[] = []
  totalHistory: AccountHistoryTotal[] = []
  selectedAccount: Account | null = null
  accountHistory: AccountHistory[] = []
  showModal = false
  form: Partial<Account> & { id?: number } = this.emptyForm()

  chartOptions: ApexChart = { type: 'area', height: 250, toolbar: { show: false } }
  chartFill: ApexFill = { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } }
  chartStroke: ApexStroke = { curve: 'smooth', width: 2 }
  chartDataLabels: ApexDataLabels = { enabled: false }
  chartTooltip: ApexTooltip = { y: { formatter: (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2 }) } }
  chartYAxis: ApexYAxis = { labels: { formatter: (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 0 }) } }
  totalChartYAxis: ApexYAxis = { min: 0, labels: { formatter: (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 0 }) } }
  totalChartColors: string[] = ['#198754']

  get chartSeries(): ApexAxisChartSeries {
    return [{ name: 'Total Balance', data: this.totalHistory.map(h => h.totalAmount) }]
  }

  get chartXAxis(): ApexXAxis {
    return { categories: this.totalHistory.map(h => h.date), type: 'category' }
  }

  get accountChartSeries(): ApexAxisChartSeries {
    return [{ name: 'Balance', data: this.accountHistory.map(h => h.amount) }]
  }

  get accountChartXAxis(): ApexXAxis {
    return { categories: this.accountHistory.map(h => h.date), type: 'category' }
  }

  constructor(private svc: AccountService) {}

  ngOnInit() {
    this.load()
    this.loadTotalHistory()
  }

  load() { this.svc.getAll().subscribe(data => this.items = data) }

  loadTotalHistory() {
    this.svc.getTotalHistory().subscribe(data => {
      this.totalHistory = data
      const amounts = data.map(h => h.totalAmount)
      const max = amounts.length > 0 ? Math.max(...amounts) * 1.5 : undefined
      const min = amounts.length > 0 ? Math.min(...amounts) / 2 : 0
      this.totalChartYAxis = {
        min,
        max,
        labels: { formatter: (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 0 }) },
      }
    })
  }

  selectAccount(a: Account) {
    this.selectedAccount = a
    this.svc.getHistory(a.id).subscribe(data => this.accountHistory = data)
  }

  get total() { return this.items.reduce((sum, a) => sum + a.amount, 0) }
  get totalRegular() { return this.items.filter(a => a.accountType !== 'Investment').reduce((sum, a) => sum + a.amount, 0) }
  get totalInvestment() { return this.items.filter(a => a.accountType === 'Investment').reduce((sum, a) => sum + a.amount, 0) }

  emptyForm() { return { name: '', amount: 0, accountType: 'Regular' } }

  openForm(a?: Account) {
    this.form = a ? { ...a } : this.emptyForm()
    this.showModal = true
  }

  closeForm() { this.showModal = false }

  save() {
    if (this.form.id) {
      this.svc.update(this.form as Account).subscribe(() => {
        this.load()
        this.loadTotalHistory()
        if (this.selectedAccount?.id === this.form.id)
          this.svc.getHistory(this.form.id!).subscribe(data => this.accountHistory = data)
        this.closeForm()
      })
    } else {
      this.svc.create({ name: this.form.name!, amount: this.form.amount!, accountType: this.form.accountType ?? 'Regular' }).subscribe(() => {
        this.load()
        this.loadTotalHistory()
        this.closeForm()
      })
    }
  }

  delete(id: number) {
    if (confirm('Delete this account?')) {
      if (this.selectedAccount?.id === id) {
        this.selectedAccount = null
        this.accountHistory = []
      }
      this.svc.delete(id).subscribe(() => {
        this.load()
        this.loadTotalHistory()
      })
    }
  }
}
