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

      <!-- Total portfolio chart — always displayed -->
      <div class="row mb-3">
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
                  [yaxis]="chartYAxis"
                  [fill]="chartFill"
                  [stroke]="chartStroke"
                  [dataLabels]="chartDataLabels"
                  [tooltip]="chartTooltip"
                ></apx-chart>
              } @else {
                <p class="text-muted text-center py-3 mb-0">No history yet. Save an account to start tracking.</p>
              }
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Account Name</th>
                    <th>Amount</th>
                    <th>Last Modified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (a of items; track a.id) {
                    <tr
                      [class.table-active]="selectedAccount?.id === a.id"
                      style="cursor:pointer"
                      (click)="selectAccount(a)"
                    >
                      <td>{{ a.name }}</td>
                      <td class="fw-medium">{{ a.amount | number:'1.2-2' }}</td>
                      <td class="text-muted small">{{ a.lastModified }}</td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary me-1" (click)="openForm(a); $event.stopPropagation()">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" (click)="delete(a.id); $event.stopPropagation()">Delete</button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="4" class="text-center text-muted py-4">No accounts found.</td></tr>
                  }
                </tbody>
                <tfoot>
                  <tr class="table-active border-top border-2">
                    <td class="fw-bold">
                      <iconify-icon icon="tabler:wallet" width="16" class="me-1"></iconify-icon>
                      Total Available
                    </td>
                    <td class="fw-bold fs-5 text-primary">{{ total | number:'1.2-2' }}</td>
                    <td colspan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Per-account chart — shown when a row is selected -->
      @if (selectedAccount) {
        <div class="row mt-3">
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

  loadTotalHistory() { this.svc.getTotalHistory().subscribe(data => this.totalHistory = data) }

  selectAccount(a: Account) {
    this.selectedAccount = a
    this.svc.getHistory(a.id).subscribe(data => this.accountHistory = data)
  }

  get total() { return this.items.reduce((sum, a) => sum + a.amount, 0) }

  emptyForm() { return { name: '', amount: 0 } }

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
      this.svc.create({ name: this.form.name!, amount: this.form.amount! }).subscribe(() => {
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
