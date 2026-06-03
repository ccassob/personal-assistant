import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DecimalPipe } from '@angular/common'
import { Category, CategoryService } from '../../core/services/api/category.service'
import { Budget, BudgetService } from '../../core/services/api/budget.service'
import { TransactionService } from '../../core/services/api/transaction.service'
import { AppSettingsService } from '../../core/services/api/app-settings.service'

interface BudgetRow extends Budget {
  actual: number
  remaining: number
  pct: number
}

@Component({
  selector: 'app-budgets',
  imports: [FormsModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Budgets</h4>
            <button class="btn btn-primary" (click)="openForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Budget
            </button>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-12">
          <div class="card">
            <div class="card-body py-2">
              <div class="d-flex gap-2 align-items-end">
                <div>
                  <label class="form-label mb-1">Month</label>
                  <select class="form-select form-select-sm" [(ngModel)]="selectedMonth" (change)="load()">
                    @for (m of months; track m.value) {
                      <option [value]="m.value">{{ m.label }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="form-label mb-1">Year</label>
                  <input type="number" class="form-control form-control-sm" [(ngModel)]="selectedYear" (change)="load()" style="width:90px">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 d-none d-md-block">
          <div class="card">
            <div class="card-body">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Target</th>
                    <th>Actual Spent</th>
                    <th>Remaining</th>
                    <th>Progress</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (b of rows; track b.id) {
                    <tr>
                      <td>{{ b.category?.name }}</td>
                      <td>{{ b.targetAmount | number:'1.2-2' }}</td>
                      <td>{{ b.actual | number:'1.2-2' }}</td>
                      <td [class.text-danger]="b.remaining < 0">{{ b.remaining | number:'1.2-2' }}</td>
                      <td style="min-width:120px">
                        <div class="progress" style="height:6px">
                          <div class="progress-bar" [class.bg-danger]="b.pct>100" [class.bg-warning]="b.pct>75 && b.pct<=100" [class.bg-success]="b.pct<=75"
                               [style.width.%]="b.pct > 100 ? 100 : b.pct"></div>
                        </div>
                        <small>{{ b.pct | number:'1.0-0' }}%</small>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary me-1" (click)="openForm(b)">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" (click)="delete(b.id)">Delete</button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="6" class="text-center text-muted py-4">No budgets for this period.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

      <!-- Mobile card list -->
      <div class="col-12 d-md-none">
        @for (b of rows; track b.id) {
          <div class="card mb-2">
            <div class="card-body py-2">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fw-semibold">{{ b.category?.name }}</span>
                <span class="text-muted small" [class.text-danger]="b.remaining < 0">
                  {{ b.remaining | number:'1.2-2' }} left
                </span>
              </div>
              <div class="d-flex justify-content-between text-muted small mb-2">
                <span>Target: {{ b.targetAmount | number:'1.2-2' }}</span>
                <span>Spent: {{ b.actual | number:'1.2-2' }}</span>
              </div>
              <div class="progress mb-2" style="height:6px">
                <div class="progress-bar" [class.bg-danger]="b.pct>100" [class.bg-warning]="b.pct>75 && b.pct<=100" [class.bg-success]="b.pct<=75"
                     [style.width.%]="b.pct > 100 ? 100 : b.pct"></div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">{{ b.pct | number:'1.0-0' }}%</small>
                <div class="d-flex gap-1">
                  <button class="btn btn-sm btn-outline-primary" (click)="openForm(b)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" (click)="delete(b.id)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="text-center text-muted py-4">No budgets for this period.</div>
        }
      </div>
      </div>
    </div>

    @if (showModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ form.id ? 'Edit' : 'Add' }} Budget</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Category</label>
                <select class="form-select" [(ngModel)]="form.categoryId">
                  @for (c of categories; track c.id) {
                    <option [value]="c.id">{{ c.name }}</option>
                  }
                </select>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Month</label>
                  <select class="form-select" [(ngModel)]="form.month">
                    @for (m of months; track m.value) {
                      <option [value]="m.value">{{ m.label }}</option>
                    }
                  </select>
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Year</label>
                  <input type="number" class="form-control" [(ngModel)]="form.year">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Target Amount</label>
                <input type="number" class="form-control" [(ngModel)]="form.targetAmount" min="0" step="0.01">
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
export class Budgets implements OnInit {
  rows: BudgetRow[] = []
  categories: Category[] = []
  showModal = false
  selectedMonth = new Date().getMonth() + 1
  selectedYear = new Date().getFullYear()
  form: Partial<Omit<Budget, 'category'>> & { id?: number } = this.emptyForm()

  months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ]

  constructor(private svc: BudgetService, private catSvc: CategoryService, private txSvc: TransactionService, private settingsSvc: AppSettingsService) {}

  ngOnInit() {
    this.catSvc.getAll().subscribe(c => this.categories = c)
    this.settingsSvc.get().subscribe(s => {
      const today = new Date()
      const day = today.getDate()
      const month = today.getMonth() + 1
      const year = today.getFullYear()
      if (day >= s.cutoffDay) {
        this.selectedMonth = month
        this.selectedYear = year
      } else {
        this.selectedMonth = month === 1 ? 12 : month - 1
        this.selectedYear = month === 1 ? year - 1 : year
      }
      this.load()
    })
  }

  load() {
    this.svc.getAll(this.selectedMonth, this.selectedYear).subscribe(budgets => {
      this.txSvc.getAll({ month: this.selectedMonth, year: this.selectedYear, type: 'Expense' }).subscribe(txs => {
        this.rows = budgets.map(b => {
          const actual = txs.filter(t => t.categoryId === b.categoryId).reduce((s, t) => s + t.amount, 0)
          const remaining = b.targetAmount - actual
          const pct = b.targetAmount > 0 ? (actual / b.targetAmount) * 100 : 0
          return { ...b, actual, remaining, pct }
        })
      })
    })
  }

  emptyForm() {
    return { categoryId: undefined as any, month: this.selectedMonth, year: this.selectedYear, targetAmount: 0 }
  }

  openForm(b?: Budget) {
    this.form = b ? { id: b.id, categoryId: b.categoryId, month: b.month, year: b.year, targetAmount: b.targetAmount } : this.emptyForm()
    this.showModal = true
  }

  closeForm() { this.showModal = false }

  save() {
    const payload = { ...this.form } as any
    if (this.form.id) {
      this.svc.update(payload).subscribe(() => { this.load(); this.closeForm() })
    } else {
      this.svc.create(payload).subscribe(() => { this.load(); this.closeForm() })
    }
  }

  delete(id: number) {
    if (confirm('Delete this budget?')) {
      this.svc.delete(id).subscribe(() => this.load())
    }
  }
}
