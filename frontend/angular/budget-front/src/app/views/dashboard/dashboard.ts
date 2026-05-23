import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DecimalPipe } from '@angular/common'
import { NgApexchartsModule } from 'ng-apexcharts'
import { ApexChart, ApexNonAxisChartSeries, ApexDataLabels, ApexLegend, ApexResponsive,
         ApexAxisChartSeries, ApexXAxis, ApexPlotOptions, ApexFill, ApexStroke } from 'ng-apexcharts'
import { DashboardService, DashboardSummary, TrendPoint } from '../../core/services/api/dashboard.service'
import { AppSettingsService } from '../../core/services/api/app-settings.service'
import { AccountService } from '../../core/services/api/account.service'

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, NgApexchartsModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Dashboard</h4>
            <div class="d-flex gap-2 align-items-center">
              <button class="btn btn-sm btn-outline-secondary" (click)="prevPeriod()">
                <iconify-icon icon="tabler:chevron-left" width="16"></iconify-icon>
              </button>
              <span class="fw-semibold">{{ periodLabel }}</span>
              <button class="btn btn-sm btn-outline-secondary" (click)="nextPeriod()">
                <iconify-icon icon="tabler:chevron-right" width="16"></iconify-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary cards -->
      <div class="row g-3 mb-3">
        <div class="col-sm-6 col-xl-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-muted mb-1">Total Income</p>
                  <h4 class="text-success mb-0">{{ summary?.totalIncome | number:'1.2-2' }}</h4>
                </div>
                <div class="fs-3 text-success opacity-50"><iconify-icon icon="tabler:trending-up" width="36"></iconify-icon></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-muted mb-1">Total Expense</p>
                  <h4 class="text-danger mb-0">{{ summary?.totalExpense | number:'1.2-2' }}</h4>
                </div>
                <div class="fs-3 text-danger opacity-50"><iconify-icon icon="tabler:trending-down" width="36"></iconify-icon></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-muted mb-1">Net Balance</p>
                  <h4 [class.text-success]="(summary?.netBalance ?? 0) >= 0" [class.text-danger]="(summary?.netBalance ?? 0) < 0" class="mb-0">
                    {{ summary?.netBalance | number:'1.2-2' }}
                  </h4>
                </div>
                <div class="fs-3 opacity-50"><iconify-icon icon="tabler:wallet" width="36"></iconify-icon></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-muted mb-1">Active Goals</p>
                  <h4 class="mb-0">{{ activeGoals }}</h4>
                </div>
                <div class="fs-3 opacity-50"><iconify-icon icon="tabler:target" width="36"></iconify-icon></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="row g-3 mb-3">
        <div class="col-xl-5">
          <div class="card h-100">
            <div class="card-header"><h5 class="card-title mb-0">Spending by Category</h5></div>
            <div class="card-body">
              @if (pieHasData) {
                <apx-chart
                  [series]="pieSeries"
                  [chart]="pieChart"
                  [labels]="pieLabels"
                  [colors]="pieColors"
                  [legend]="pieLegend"
                  [dataLabels]="pieDataLabels"
                  [responsive]="pieResponsive">
                </apx-chart>
              } @else {
                <div class="text-center text-muted py-5">No expense data this period.</div>
              }
            </div>
          </div>
        </div>
        <div class="col-xl-7">
          <div class="card h-100">
            <div class="card-header"><h5 class="card-title mb-0">Budget vs Actual</h5></div>
            <div class="card-body">
              @if (barHasData) {
                <apx-chart
                  [series]="barSeries"
                  [chart]="barChart"
                  [xaxis]="barXaxis"
                  [plotOptions]="barPlotOptions"
                  [dataLabels]="barDataLabels">
                </apx-chart>
              } @else {
                <div class="text-center text-muted py-5">No budget data this period.</div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Goals progress -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="card">
            <div class="card-header"><h5 class="card-title mb-0">Goals Progress</h5></div>
            <div class="card-body">
              @if (summary?.goals?.length) {
                @for (g of summary!.goals; track g.id) {
                  <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                      <span>{{ g.name }}</span>
                      <span class="badge" [class.bg-success]="g.status==='Completed'" [class.bg-warning]="g.status==='Paused'" [class.bg-primary]="g.status==='Active'">
                        {{ g.status }}
                      </span>
                    </div>
                    <div class="d-flex justify-content-between small text-muted mb-1">
                      <span>{{ g.currentAmount | number:'1.2-2' }} saved</span>
                      <span>Target: {{ g.targetAmount | number:'1.2-2' }}</span>
                    </div>
                    <div class="progress" style="height:8px">
                      <div class="progress-bar bg-primary" [style.width.%]="goalPct(g) > 100 ? 100 : goalPct(g)"></div>
                    </div>
                  </div>
                }
              } @else {
                <p class="text-muted text-center mb-0">No goals yet.</p>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Trend chart -->
      <div class="row g-3 mb-3">
        <div class="col-12">
          <div class="card">
            <div class="card-header"><h5 class="card-title mb-0">Income vs Expense – Last 6 Periods</h5></div>
            <div class="card-body">
              @if (trendHasData) {
                <apx-chart
                  [series]="trendSeries"
                  [chart]="trendChart"
                  [xaxis]="trendXaxis"
                  [colors]="trendColors"
                  [stroke]="trendStroke"
                  [fill]="trendFill"
                  [dataLabels]="trendDataLabels">
                </apx-chart>
              } @else {
                <div class="text-center text-muted py-5">No transaction data available.</div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Account balances + Goals radial + Budget utilization -->
      <div class="row g-3 mb-3">
        <div class="col-xl-4">
          <div class="card h-100">
            <div class="card-header"><h5 class="card-title mb-0">Account Balances</h5></div>
            <div class="card-body">
              @if (accountHasData) {
                <apx-chart
                  [series]="accountSeries"
                  [chart]="accountChart"
                  [xaxis]="accountXaxis"
                  [plotOptions]="accountPlotOptions"
                  [dataLabels]="accountDataLabels">
                </apx-chart>
              } @else {
                <div class="text-center text-muted py-5">No accounts found.</div>
              }
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="card h-100">
            <div class="card-header"><h5 class="card-title mb-0">Goals Progress</h5></div>
            <div class="card-body">
              @if (radialHasData) {
                <apx-chart
                  [series]="radialSeries"
                  [chart]="radialChart"
                  [labels]="radialLabels"
                  [plotOptions]="radialPlotOptions">
                </apx-chart>
              } @else {
                <div class="text-center text-muted py-5">No goals data.</div>
              }
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="card h-100">
            <div class="card-header"><h5 class="card-title mb-0">Budget Utilization</h5></div>
            <div class="card-body">
              @if (utilHasData) {
                <apx-chart
                  [series]="utilSeries"
                  [chart]="utilChart"
                  [xaxis]="utilXaxis"
                  [plotOptions]="utilPlotOptions"
                  [dataLabels]="utilDataLabels">
                </apx-chart>
              } @else {
                <div class="text-center text-muted py-5">No budget data this period.</div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Dashboard implements OnInit {
  summary: DashboardSummary | null = null
  selectedMonth = new Date().getMonth() + 1
  selectedYear = new Date().getFullYear()
  cutoffDay = 1

  // Pie chart
  pieSeries: ApexNonAxisChartSeries = []
  pieLabels: string[] = []
  pieColors: string[] = []
  pieHasData = false
  pieChart: ApexChart = { type: 'pie', height: 300 }
  pieLegend: ApexLegend = { position: 'bottom' }
  pieDataLabels: ApexDataLabels = { enabled: true }
  pieResponsive: ApexResponsive[] = [{ breakpoint: 480, options: { legend: { position: 'bottom' } } }]

  // Bar chart
  barSeries: ApexAxisChartSeries = []
  barXaxis: ApexXAxis = { categories: [] }
  barHasData = false
  barChart: ApexChart = { type: 'bar', height: 300 }
  barPlotOptions: ApexPlotOptions = { bar: { horizontal: false, columnWidth: '55%' } }
  barDataLabels: ApexDataLabels = { enabled: false }

  // Trend chart (area)
  trendSeries: ApexAxisChartSeries = []
  trendXaxis: ApexXAxis = { categories: [] }
  trendHasData = false
  trendChart: ApexChart = { type: 'area', height: 300, toolbar: { show: false } }
  trendColors: string[] = ['#2ecc71', '#e74c3c']
  trendStroke: ApexStroke = { curve: 'smooth', width: 2 }
  trendFill: ApexFill = { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } }
  trendDataLabels: ApexDataLabels = { enabled: false }

  // Account balances (horizontal bar)
  accountSeries: ApexAxisChartSeries = []
  accountXaxis: ApexXAxis = { categories: [] }
  accountHasData = false
  accountChart: ApexChart = { type: 'bar', height: 200, toolbar: { show: false } }
  accountPlotOptions: ApexPlotOptions = { bar: { horizontal: true, barHeight: '60%' } }
  accountDataLabels: ApexDataLabels = { enabled: true, formatter: (val: number) => Number(val).toFixed(2) }

  // Goals radial
  radialSeries: ApexNonAxisChartSeries = []
  radialLabels: string[] = []
  radialHasData = false
  radialChart: ApexChart = { type: 'radialBar', height: 350 }
  radialPlotOptions: ApexPlotOptions = {
    radialBar: { dataLabels: { name: { show: true }, value: { formatter: (v: number) => `${v.toFixed(0)}%` } } }
  }

  // Budget utilization (horizontal bar %)
  utilSeries: ApexAxisChartSeries = []
  utilXaxis: ApexXAxis = { categories: [] }
  utilHasData = false
  utilChart: ApexChart = { type: 'bar', height: 250, toolbar: { show: false } }
  utilPlotOptions: ApexPlotOptions = { bar: { horizontal: true, barHeight: '60%' } }
  utilDataLabels: ApexDataLabels = { enabled: true, formatter: (val: number) => `${Number(val).toFixed(0)}%` }

  constructor(private svc: DashboardService, private settingsSvc: AppSettingsService, private accountSvc: AccountService) {}

  ngOnInit() {
    this.settingsSvc.get().subscribe(s => {
      this.cutoffDay = s.cutoffDay
      const today = new Date()
      const day = today.getDate()
      const month = today.getMonth() + 1
      const year = today.getFullYear()
      if (day >= this.cutoffDay) {
        this.selectedMonth = month
        this.selectedYear = year
      } else {
        this.selectedMonth = month === 1 ? 12 : month - 1
        this.selectedYear = month === 1 ? year - 1 : year
      }
      this.load()
      this.loadTrend()
      this.loadAccounts()
    })
  }

  load() {
    this.svc.getSummary(this.selectedMonth, this.selectedYear).subscribe(data => {
      this.summary = data
      this.buildPie(data)
      this.buildBar(data)
      this.buildRadial(data)
      this.buildUtilization(data)
    })
  }

  loadTrend() {
    this.svc.getTrend(6).subscribe(data => {
      this.trendHasData = data.length > 0
      this.trendXaxis = { categories: data.map(d => d.label) }
      this.trendSeries = [
        { name: 'Income', data: data.map(d => d.income) },
        { name: 'Expense', data: data.map(d => d.expense) },
      ]
    })
  }

  loadAccounts() {
    this.accountSvc.getAll().subscribe(accounts => {
      this.accountHasData = accounts.length > 0
      this.accountXaxis = { categories: accounts.map(a => a.name) }
      this.accountSeries = [{ name: 'Balance', data: accounts.map(a => a.amount) }]
    })
  }

  get periodLabel(): string {
    const { start, end } = this.computePeriod(this.cutoffDay, this.selectedMonth, this.selectedYear)
    return `${this.fmt(start)} – ${this.fmt(end)}`
  }

  computePeriod(cutoffDay: number, month: number, year: number) {
    const daysInMonth = new Date(year, month, 0).getDate()
    const day = Math.min(cutoffDay, daysInMonth)
    const start = new Date(year, month - 1, day)
    const end = new Date(year, month, day)
    end.setDate(end.getDate() - 1)
    return { start, end }
  }

  fmt(d: Date) {
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  prevPeriod() {
    if (this.selectedMonth === 1) { this.selectedMonth = 12; this.selectedYear-- }
    else { this.selectedMonth-- }
    this.load()
  }

  nextPeriod() {
    if (this.selectedMonth === 12) { this.selectedMonth = 1; this.selectedYear++ }
    else { this.selectedMonth++ }
    this.load()
  }

  get activeGoals() {
    return this.summary?.goals.filter(g => g.status === 'Active').length ?? 0
  }

  goalPct(g: { targetAmount: number; currentAmount: number }) {
    return g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0
  }

  buildPie(data: DashboardSummary) {
    const cats = data.spendingByCategory.filter(c => c.amount > 0)
    this.pieHasData = cats.length > 0
    this.pieSeries = cats.map(c => c.amount)
    this.pieLabels = cats.map(c => c.categoryName)
    this.pieColors = cats.map(c => c.color || '#3b82f6')
  }

  buildBar(data: DashboardSummary) {
    this.barHasData = data.budgetVsActual.length > 0
    this.barXaxis = { categories: data.budgetVsActual.map(b => b.categoryName) }
    this.barSeries = [
      { name: 'Target', data: data.budgetVsActual.map(b => b.target) },
      { name: 'Actual', data: data.budgetVsActual.map(b => b.actual) },
    ]
  }

  buildRadial(data: DashboardSummary) {
    const goals = data.goals.filter(g => g.targetAmount > 0)
    this.radialHasData = goals.length > 0
    this.radialLabels = goals.map(g => g.name)
    this.radialSeries = goals.map(g => Math.min((g.currentAmount / g.targetAmount) * 100, 100))
  }

  buildUtilization(data: DashboardSummary) {
    const items = data.budgetVsActual.filter(b => b.target > 0)
    this.utilHasData = items.length > 0
    this.utilXaxis = { categories: items.map(b => b.categoryName) }
    this.utilSeries = [{ name: '% Used', data: items.map(b => Math.round((b.actual / b.target) * 100)) }]
  }
}
