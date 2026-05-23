import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DecimalPipe } from '@angular/common'
import { CategoryService, Category } from '../../core/services/api/category.service'
import { RecurringTransaction, RecurringTransactionService } from '../../core/services/api/recurring-transaction.service'
import { AppSettingsService } from '../../core/services/api/app-settings.service'

@Component({
  selector: 'app-recurring-transactions',
  imports: [FormsModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Recurring Transactions</h4>
            <button class="btn btn-primary" (click)="openForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Template
            </button>
          </div>
        </div>
      </div>

      <!-- Generate -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="card">
            <div class="card-body py-2">
              <div class="row g-2 align-items-end">
                <div class="col-auto">
                  <label class="form-label mb-1">Month</label>
                  <select class="form-select form-select-sm" [(ngModel)]="generate.month">
                    @for (m of months; track m.value) {
                      <option [value]="m.value">{{ m.label }}</option>
                    }
                  </select>
                </div>
                <div class="col-auto">
                  <label class="form-label mb-1">Year</label>
                  <input type="number" class="form-control form-control-sm" [(ngModel)]="generate.year" style="width:90px">
                </div>
                <div class="col-auto">
                  <button class="btn btn-sm btn-success" (click)="generateTransactions()">
                    <iconify-icon icon="tabler:refresh" width="16"></iconify-icon> Generate Transactions
                  </button>
                </div>
                <div class="col-auto align-self-end">
                  <small class="text-muted">{{ generatePeriodLabel }}</small>
                </div>
                @if (generateResult !== null) {
                  <div class="col-auto">
                    <span class="badge bg-success fs-6">{{ generateResult }} transaction(s) created</span>
                  </div>
                }
              </div>
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
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Day of Month</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (r of items; track r.id) {
                    <tr>
                      <td>{{ r.description }}</td>
                      <td>{{ r.category?.name ?? '—' }}</td>
                      <td>
                        <span class="badge" [class.bg-success]="r.type==='Income'" [class.bg-danger]="r.type==='Expense'">
                          {{ r.type }}
                        </span>
                      </td>
                      <td [class.text-success]="r.type==='Income'" [class.text-danger]="r.type==='Expense'">
                        {{ r.type === 'Income' ? '+' : '-' }}{{ r.amount | number:'1.2-2' }}
                      </td>
                      <td>{{ r.dayOfMonth }}</td>
                      <td>
                        <span class="badge" [class.bg-success]="r.isActive" [class.bg-secondary]="!r.isActive">
                          {{ r.isActive ? 'Yes' : 'No' }}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary me-1" (click)="openForm(r)">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" (click)="delete(r.id)">Delete</button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="7" class="text-center text-muted py-4">No recurring templates found.</td></tr>
                  }
                </tbody>
                <tfoot>
                  <tr class="table-active border-top border-2">
                    <td colspan="3" class="fw-bold">
                      <iconify-icon icon="tabler:refresh" width="16" class="me-1"></iconify-icon>
                      Total
                    </td>
                    <td class="fw-bold fs-5" [class.text-success]="recurringNet >= 0" [class.text-danger]="recurringNet < 0">
                      {{ recurringNet >= 0 ? '+' : '' }}{{ recurringNet | number:'1.2-2' }}
                    </td>
                    <td colspan="3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    @if (showModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ form.id ? 'Edit' : 'Add' }} Recurring Template</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Description</label>
                <input class="form-control" [(ngModel)]="form.description">
              </div>
              <div class="mb-3">
                <label class="form-label">Type</label>
                <select class="form-select" [(ngModel)]="form.type">
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Category</label>
                <select class="form-select" [(ngModel)]="form.categoryId">
                  <option [value]="undefined">— None —</option>
                  @for (c of categories; track c.id) {
                    <option [value]="c.id">{{ c.name }}</option>
                  }
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Amount</label>
                <input type="number" class="form-control" [(ngModel)]="form.amount" min="0" step="0.01">
              </div>
              <div class="mb-3">
                <label class="form-label">Day of Month</label>
                <input type="number" class="form-control" [(ngModel)]="form.dayOfMonth" min="1" max="31">
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="isActive" [(ngModel)]="form.isActive">
                <label class="form-check-label" for="isActive">Active</label>
              </div>
              <div class="mb-3">
                <label class="form-label">Notes</label>
                <textarea class="form-control" [(ngModel)]="form.notes" rows="2"></textarea>
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
export class RecurringTransactions implements OnInit {
  items: RecurringTransaction[] = []
  categories: Category[] = []
  showModal = false
  generateResult: number | null = null
  generate = { month: new Date().getMonth() + 1, year: new Date().getFullYear() }
  form: Partial<Omit<RecurringTransaction, 'category'>> & { id?: number } = this.emptyForm()

  months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ]

  cutoffDay = 1

  constructor(private svc: RecurringTransactionService, private catSvc: CategoryService, private settingsSvc: AppSettingsService) {}

  ngOnInit() {
    this.settingsSvc.get().subscribe(s => {
      this.cutoffDay = s.cutoffDay
      const today = new Date()
      const day = today.getDate()
      const month = today.getMonth() + 1
      const year = today.getFullYear()
      if (day >= this.cutoffDay) {
        this.generate.month = month
        this.generate.year = year
      } else {
        this.generate.month = month === 1 ? 12 : month - 1
        this.generate.year = month === 1 ? year - 1 : year
      }
    })
    this.catSvc.getAll().subscribe(c => this.categories = c)
    this.load()
  }

  get generatePeriodLabel(): string {
    const { start, end } = this.computePeriod(this.cutoffDay, this.generate.month, this.generate.year)
    return `Period: ${this.fmt(start)} – ${this.fmt(end)}`
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

  load() { this.svc.getAll().subscribe(data => this.items = data) }

  get recurringIncome() { return this.items.filter(r => r.isActive && r.type === 'Income').reduce((s, r) => s + r.amount, 0) }
  get recurringExpense() { return this.items.filter(r => r.isActive && r.type === 'Expense').reduce((s, r) => s + r.amount, 0) }
  get recurringNet() { return this.recurringIncome - this.recurringExpense }

  emptyForm() {
    return { description: '', type: 'Expense', categoryId: undefined, amount: 0, dayOfMonth: 1, notes: '', isActive: true }
  }

  openForm(r?: RecurringTransaction) {
    this.form = r
      ? { id: r.id, description: r.description, type: r.type, categoryId: r.categoryId, amount: r.amount, dayOfMonth: r.dayOfMonth, notes: r.notes, isActive: r.isActive }
      : this.emptyForm()
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
    if (confirm('Delete this recurring template?')) {
      this.svc.delete(id).subscribe(() => this.load())
    }
  }

  generateTransactions() {
    this.generateResult = null
    this.svc.generate(this.generate.month, this.generate.year).subscribe(created => {
      this.generateResult = created.length
    })
  }
}
