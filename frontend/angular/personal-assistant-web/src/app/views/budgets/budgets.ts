import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DecimalPipe } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Category, CategoryService } from '../../core/services/api/category.service'
import { BudgetService, BudgetYearRow } from '../../core/services/api/budget.service'

@Component({
  selector: 'app-budgets',
  imports: [FormsModule, DecimalPipe, RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Limits</h4>
          </div>
        </div>
      </div>

      <!-- Budget sub-nav -->
      <div class="row mb-1">
        <div class="col-12">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link" routerLink="/transactions" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Transactions</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/recurring-transactions" routerLinkActive="active">Recurring</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categories" routerLinkActive="active">Categories</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/budgets" routerLinkActive="active">Limits</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Controls -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="card">
            <div class="card-body py-2">
              <div class="d-flex flex-wrap gap-3 align-items-end">
                <div>
                  <label class="form-label mb-1">Year</label>
                  <input type="number" class="form-control form-control-sm" [(ngModel)]="selectedYear" (change)="loadData()" style="width:90px">
                </div>
                @if (activeTab === 'progress') {
                  <div>
                    <label class="form-label mb-1">Month</label>
                    <select class="form-select form-select-sm" [(ngModel)]="progressMonth" style="width:140px">
                      @for (m of monthsFull; track $index) {
                        <option [value]="$index + 1">{{ m }}</option>
                      }
                    </select>
                  </div>
                }
                <div class="ms-auto">
                  <ul class="nav nav-pills">
                    <li class="nav-item">
                      <button class="nav-link" [class.active]="activeTab === 'matrix'" (click)="activeTab = 'matrix'">
                        <iconify-icon icon="tabler:table" width="14"></iconify-icon> Matrix
                      </button>
                    </li>
                    <li class="nav-item">
                      <button class="nav-link" [class.active]="activeTab === 'progress'" (click)="activeTab = 'progress'">
                        <iconify-icon icon="tabler:chart-bar" width="14"></iconify-icon> Progress
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Matrix tab -->
      @if (activeTab === 'matrix') {
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body p-0" style="overflow-x:auto">
                <table class="table table-sm table-bordered mb-0" style="min-width:1100px">
                  <thead class="table-light">
                    <tr>
                      <th style="min-width:150px; position:sticky; left:0; background:#f8f9fa; z-index:2">Category</th>
                      @for (label of monthsShort; track $index) {
                        <th class="text-center" style="min-width:88px">{{ label }}</th>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    @for (cat of categories; track cat.id) {
                      <tr>
                        <td style="position:sticky; left:0; background:white; z-index:1; font-weight:500">
                          {{ cat.name }}
                        </td>
                        @for (m of monthNums; track m) {
                          <td class="p-1 text-center">
                            <input type="number" class="form-control form-control-sm text-center"
                                   [(ngModel)]="cellValues[cat.id + '-' + m]"
                                   (blur)="onBlur(cat.id, m)"
                                   min="0" step="100"
                                   style="width:76px; margin:0 auto">
                            <small class="text-muted" style="font-size:0.7rem">
                              {{ (cellActuals[cat.id + '-' + m] || 0) | number:'1.0-0' }}
                            </small>
                          </td>
                        }
                      </tr>
                    }
                    @empty {
                      <tr>
                        <td [attr.colspan]="13" class="text-center text-muted py-4">
                          No expense categories found. Add categories first.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <small class="text-muted ms-1">Top row: limit amount (editable). Bottom: actual spent.</small>
          </div>
        </div>
      }

      <!-- Progress tab -->
      @if (activeTab === 'progress') {
        <div class="row">
          @for (row of progressRows; track row.cat.id) {
            <div class="col-12 mb-2">
              <div class="card">
                <div class="card-body py-2">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="fw-semibold">{{ row.cat.name }}</span>
                    <span [class.text-danger]="row.remaining < 0" [class.text-success]="row.remaining >= 0 && row.target > 0">
                      {{ row.remaining | number:'1.2-2' }} left
                    </span>
                  </div>
                  <div class="d-flex justify-content-between text-muted small mb-2">
                    <span>Limit: {{ row.target | number:'1.2-2' }}</span>
                    <span>Spent: {{ row.actual | number:'1.2-2' }}</span>
                  </div>
                  @if (row.target > 0) {
                    <div class="progress mb-1" style="height:8px">
                      <div class="progress-bar"
                           [class.bg-danger]="row.pct > 100"
                           [class.bg-warning]="row.pct > 75 && row.pct <= 100"
                           [class.bg-success]="row.pct <= 75"
                           [style.width.%]="row.pct > 100 ? 100 : row.pct"></div>
                    </div>
                    <small class="text-muted">{{ row.pct | number:'1.0-0' }}%</small>
                  } @else {
                    <small class="text-muted fst-italic">No limit set</small>
                  }
                </div>
              </div>
            </div>
          }
          @if (progressRows.length === 0) {
            <div class="col-12">
              <div class="card">
                <div class="card-body text-center text-muted py-4">No spending or limits for this month.</div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class Budgets implements OnInit {
  activeTab: 'matrix' | 'progress' = 'matrix'
  categories: Category[] = []
  yearRows: BudgetYearRow[] = []

  cellValues: { [key: string]: number } = {}
  cellActuals: { [key: string]: number } = {}

  selectedYear = new Date().getFullYear()
  progressMonth = new Date().getMonth() + 1

  monthNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  constructor(private svc: BudgetService, private catSvc: CategoryService) {}

  ngOnInit() {
    this.catSvc.getAll().subscribe(cats => {
      this.categories = cats.filter(c => c.type === 'Expense')
      this.loadData()
    })
  }

  loadData() {
    this.svc.getYearSummary(this.selectedYear).subscribe(rows => {
      this.yearRows = rows
      this.buildCells(rows)
    })
  }

  buildCells(rows: BudgetYearRow[]) {
    this.cellValues = {}
    this.cellActuals = {}
    for (const cat of this.categories) {
      for (const m of this.monthNums) {
        const key = `${cat.id}-${m}`
        const row = rows.find(r => r.categoryId === cat.id && r.month === m)
        this.cellValues[key] = row?.targetAmount ?? 0
        this.cellActuals[key] = row?.actualSpent ?? 0
      }
    }
  }

  onBlur(catId: number, month: number) {
    const val = this.cellValues[`${catId}-${month}`] ?? 0
    this.svc.upsert({ categoryId: catId, month, year: this.selectedYear, targetAmount: val }).subscribe()
  }

  get progressRows() {
    return this.categories.map(cat => {
      const target = this.cellValues[`${cat.id}-${this.progressMonth}`] ?? 0
      const actual = this.cellActuals[`${cat.id}-${this.progressMonth}`] ?? 0
      const remaining = target - actual
      const pct = target > 0 ? (actual / target) * 100 : 0
      return { cat, target, actual, remaining, pct }
    }).filter(r => r.target > 0 || r.actual > 0)
  }
}
