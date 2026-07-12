import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DecimalPipe } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { CategoryService, Category } from '../../core/services/api/category.service'
import { Transaction, TransactionService, ImportRow } from '../../core/services/api/transaction.service'
import { AppSettingsService } from '../../core/services/api/app-settings.service'
import { RecurringTransactionService } from '../../core/services/api/recurring-transaction.service'

@Component({
  selector: 'app-transactions',
  imports: [FormsModule, DecimalPipe, RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Transactions</h4>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="importInput.click()">
                <iconify-icon icon="tabler:file-import" width="16"></iconify-icon> Import CSV
              </button>
              <input #importInput type="file" accept=".csv" style="display:none" (change)="importCsv($event)">
              <button class="btn btn-outline-secondary" (click)="exportCsv()">
                <iconify-icon icon="tabler:file-export" width="16"></iconify-icon> Export CSV
              </button>
              <button class="btn btn-outline-danger" (click)="deleteAll()">
                <iconify-icon icon="tabler:trash" width="16"></iconify-icon> Delete All
              </button>
              <button class="btn btn-primary" (click)="openForm()">
                <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Transaction
              </button>
            </div>
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

      @if (convertSuccess) {
        <div class="row mb-2">
          <div class="col-12">
            <div class="alert alert-success py-2 mb-0">Recurring template created successfully.</div>
          </div>
        </div>
      }

      @if (importResult !== null) {
        <div class="row mb-2">
          <div class="col-12">
            <div class="alert py-2 mb-0" [class.alert-success]="importResult.errors === 0" [class.alert-warning]="importResult.errors > 0">
              {{ importResult.imported }} transaction(s) imported
              @if (importResult.errors > 0) { — {{ importResult.errors }} row(s) skipped (invalid data) }
            </div>
          </div>
        </div>
      }

      <!-- Filters -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="card">
            <div class="card-body py-2">
              <div class="row g-2 align-items-end">
                <div class="col-auto">
                  <label class="form-label mb-1">Category</label>
                  <select class="form-select form-select-sm" [(ngModel)]="filter.categoryId" (change)="load()">
                    <option [value]="undefined">All</option>
                    @for (c of categories; track c.id) {
                      <option [value]="c.id">{{ c.name }}</option>
                    }
                  </select>
                </div>
                <div class="col-auto">
                  <label class="form-label mb-1">Type</label>
                  <select class="form-select form-select-sm" [(ngModel)]="filter.type" (change)="load()">
                    <option value="">All</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
                <div class="col-auto">
                  <label class="form-label mb-1">Month</label>
                  <select class="form-select form-select-sm" [(ngModel)]="filter.month" (change)="load()">
                    <option [value]="undefined">All</option>
                    @for (m of months; track m.value) {
                      <option [value]="m.value">{{ m.label }}</option>
                    }
                  </select>
                </div>
                <div class="col-auto">
                  <label class="form-label mb-1">Year</label>
                  <input type="number" class="form-control form-control-sm" [(ngModel)]="filter.year" (change)="load()" style="width:90px">
                </div>
                <div class="col-auto">
                  <button class="btn btn-sm btn-outline-secondary" (click)="clearFilters()">Clear</button>
                </div>
                @if (filter.month && filter.year) {
                  <div class="col-auto align-self-end">
                    <small class="text-muted">{{ periodRangeLabel }}</small>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 d-none d-md-block">
          <div class="card">
            <div class="card-body">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (t of transactions; track t.id) {
                    <tr>
                      <td>
                        {{ t.date }}
                      </td>
                      <td>
						
					  {{ t.description }}
					  
					  @if (dateTag(t); as tag) {
                          <span class="badge rounded-pill me-1" [style.background-color]="tag.color">{{ tag.label }}</span>
                        }
						</td>
                      <td>{{ t.category?.name ?? '—' }}</td>
                      <td>
                        <span class="badge"
                          [class.bg-success]="t.type==='Income'"
                          [class.bg-danger]="t.type==='Expense'"
                          [style.background]="t.type==='Investment' ? '#6610f2' : null">
                          {{ t.type }}
                        </span>
                      </td>
                      <td [class.text-success]="t.type==='Income'" [class.text-danger]="t.type==='Expense'" [style.color]="t.type==='Investment' ? '#0d9488' : null">
                        {{ t.type === 'Income' ? '+' : t.type === 'Expense' ? '-' : '▲' }}{{ t.amount | number:'1.2-2' }}
                      </td>
                      <td>
                        <div class="form-check form-switch mb-0">
                          <input class="form-check-input" type="checkbox" [checked]="t.isExecuted" (change)="toggleExecuted(t)">
                        </div>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary me-1" (click)="openForm(t)">Edit</button>
                        <button class="btn btn-sm btn-outline-danger me-1" (click)="delete(t.id)">Delete</button>
                        <button class="btn btn-sm btn-outline-warning" (click)="openConvertForm(t)">
                          <iconify-icon icon="tabler:refresh" width="14"></iconify-icon> Move to Recurring
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="7" class="text-center text-muted py-4">No transactions found.</td></tr>
                  }
                </tbody>
                <tfoot>
                  <tr class="small text-muted">
                    <td colspan="4"></td>
                    <td>
                      <span class="text-success me-2">+{{ totalIncome | number:'1.2-2' }}</span>
                      <span class="text-danger me-2">-{{ totalExpense | number:'1.2-2' }}</span>
                      @if (totalInvested > 0) {
                        <span style="color:#0d9488">▲{{ totalInvested | number:'1.2-2' }}</span>
                      }
                    </td>
                    <td colspan="2"></td>
                  </tr>
                  <tr class="table-active border-top border-2">
                    <td colspan="4" class="fw-bold">
                      <iconify-icon icon="tabler:arrows-exchange" width="16" class="me-1"></iconify-icon>
                      Net Balance
                    </td>
                    <td class="fw-bold fs-5" [class.text-success]="netBalance >= 0" [class.text-danger]="netBalance < 0">
                      {{ netBalance >= 0 ? '+' : '' }}{{ netBalance | number:'1.2-2' }}
                    </td>
                    <td colspan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

      <!-- Mobile card list -->
      <div class="col-12 d-md-none">
        @for (t of transactions; track t.id) {
          <div class="card mb-2">
            <div class="card-body py-2">
              <div class="d-flex justify-content-between align-items-start mb-1">
                <div>
                  <span class="fw-semibold">{{ t.description }}</span>
                  @if (dateTag(t); as tag) {
                    <span class="badge rounded-pill ms-1" [style.background-color]="tag.color">{{ tag.label }}</span>
                  }
                </div>
                <span class="fw-bold" [class.text-success]="t.type==='Income'" [class.text-danger]="t.type==='Expense'" [style.color]="t.type==='Investment' ? '#0d9488' : null">
                  {{ t.type === 'Income' ? '+' : t.type === 'Expense' ? '-' : '▲' }}{{ t.amount | number:'1.2-2' }}
                </span>
              </div>
              <div class="d-flex justify-content-between align-items-center text-muted small mb-2">
                <span>{{ t.date }} · {{ t.category?.name ?? '—' }}</span>
                <span class="badge" [class.bg-success]="t.type==='Income'" [class.bg-danger]="t.type==='Expense'" [style.background]="t.type==='Investment' ? '#6610f2' : null">{{ t.type }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <div class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" [checked]="t.isExecuted" (change)="toggleExecuted(t)">
                  <label class="form-check-label small">Executed</label>
                </div>
                <div class="d-flex gap-1">
                  <button class="btn btn-sm btn-outline-primary" (click)="openForm(t)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" (click)="delete(t.id)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="text-center text-muted py-4">No transactions found.</div>
        }
      </div>
      </div>
    </div>

    @if (showModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ form.id ? 'Edit' : 'Add' }} Transaction</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Date</label>
                <input type="date" class="form-control" [(ngModel)]="form.date">
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <input class="form-control" [(ngModel)]="form.description">
              </div>
              <div class="mb-3">
                <label class="form-label">Type</label>
                <select class="form-select" [(ngModel)]="form.type">
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                  <option value="Investment">Investment</option>
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
                <label class="form-label">Notes</label>
                <textarea class="form-control" [(ngModel)]="form.notes" rows="2"></textarea>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="isExecuted" [(ngModel)]="form.isExecuted">
                <label class="form-check-label" for="isExecuted">Executed</label>
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
    @if (showConvertModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Convert to Recurring Transaction</h5>
              <button type="button" class="btn-close" (click)="closeConvertModal()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Description</label>
                <input class="form-control" [(ngModel)]="convertForm.description">
              </div>
              <div class="mb-3">
                <label class="form-label">Type</label>
                <select class="form-select" [(ngModel)]="convertForm.type">
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Category</label>
                <select class="form-select" [(ngModel)]="convertForm.categoryId">
                  <option [value]="undefined">— None —</option>
                  @for (c of categories; track c.id) {
                    <option [value]="c.id">{{ c.name }}</option>
                  }
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Amount</label>
                <input type="number" class="form-control" [(ngModel)]="convertForm.amount" min="0" step="0.01">
              </div>
              <div class="mb-3">
                <label class="form-label">Day of Month</label>
                <input type="number" class="form-control" [(ngModel)]="convertForm.dayOfMonth" min="1" max="31">
                <div class="form-text">Day this transaction repeats each month.</div>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="convertIsActive" [(ngModel)]="convertForm.isActive">
                <label class="form-check-label" for="convertIsActive">Active</label>
              </div>
              <div class="mb-3">
                <label class="form-label">Notes</label>
                <textarea class="form-control" [(ngModel)]="convertForm.notes" rows="2"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeConvertModal()">Cancel</button>
              <button class="btn btn-primary" (click)="saveConvert()">Save as Recurring</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class Transactions implements OnInit {
  transactions: Transaction[] = []
  categories: Category[] = []
  showModal = false
  showConvertModal = false
  convertSuccess = false
  importResult: { imported: number; errors: number } | null = null
  convertForm: { description: string; type: string; categoryId?: number; amount: number; dayOfMonth: number; notes: string; isActive: boolean } = this.emptyConvertForm()
  filter: { categoryId?: number; type?: string; month?: number; year?: number } = { type: '' }
  form: Partial<Omit<Transaction, 'category'>> & { id?: number } = this.emptyForm()

  months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ]

  cutoffDay = 1
  pastColor = '#6c757d'
  todayColor = '#0d6efd'
  futureColor = '#fd7e14'

  constructor(private svc: TransactionService, private catSvc: CategoryService, private settingsSvc: AppSettingsService, private recurringSvc: RecurringTransactionService) {}

  ngOnInit() {
    this.settingsSvc.get().subscribe(s => {
      this.cutoffDay = s.cutoffDay
      this.pastColor = s.pastColor
      this.todayColor = s.todayColor
      this.futureColor = s.futureColor
      this.setCurrentPeriod()
      this.load()
    })
    this.catSvc.getAll().subscribe(c => this.categories = c)
  }

  setCurrentPeriod() {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    if (day >= this.cutoffDay) {
      this.filter.month = month
      this.filter.year = year
    } else {
      this.filter.month = month === 1 ? 12 : month - 1
      this.filter.year = month === 1 ? year - 1 : year
    }
  }

  dateTag(t: Transaction): { color: string; label: string } | null {
    if (t.isExecuted) return null
    const today = new Date().toISOString().split('T')[0]
    if (t.date < today) return { color: this.pastColor, label: 'Past' }
    if (t.date === today) return { color: this.todayColor, label: 'Today' }
    return null
  }

  get periodRangeLabel(): string {
    if (!this.filter.month || !this.filter.year) return ''
    const { start, end } = this.computePeriod(this.cutoffDay, this.filter.month, this.filter.year)
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

  load() { this.svc.getAll(this.filter).subscribe(data => this.transactions = data) }

  clearFilters() { this.filter = {}; this.load() }

  emptyForm() {
    const today = new Date().toISOString().split('T')[0]
    return { date: today, description: '', type: 'Expense', categoryId: undefined, amount: 0, notes: '', isExecuted: false }
  }

  openForm(t?: Transaction) {
    this.form = t ? { id: t.id, date: t.date, description: t.description, type: t.type, categoryId: t.categoryId, amount: t.amount, notes: t.notes, isExecuted: t.isExecuted } : this.emptyForm()
    this.showModal = true
  }

  toggleExecuted(t: Transaction) {
    this.svc.update({ ...t, isExecuted: !t.isExecuted }).subscribe(() => this.load())
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

  parseCsv(text: string): string[][] {
    return text.trim().split('\n').map(line => {
      const fields: string[] = []
      let current = ''
      let inQuotes = false
      for (const ch of line.replace(/\r/g, '')) {
        if (ch === '"') { inQuotes = !inQuotes }
        else if (ch === ',' && !inQuotes) { fields.push(current.trim()); current = '' }
        else { current += ch }
      }
      fields.push(current.trim())
      return fields
    })
  }

  importCsv(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const lines = this.parseCsv(reader.result as string)
      const rows: ImportRow[] = lines.slice(1)
        .filter(cols => cols.length >= 4 && cols[0])
        .map(cols => ({
          date: cols[0],
          description: cols[1] ?? '',
          amount: parseFloat(cols[2]) || 0,
          type: cols[3],
          category: cols[4] || undefined,
          notes: cols[5] || undefined,
          isExecuted: cols[6]?.toLowerCase() === 'true'
        }))
      this.svc.import(rows).subscribe(result => {
        this.importResult = result
        this.load()
        setTimeout(() => this.importResult = null, 5000)
        ;(event.target as HTMLInputElement).value = ''
      })
    }
    reader.readAsText(file)
  }

  exportCsv() {
    const header = 'Date,Description,Amount,Type,Category,Notes,IsExecuted'
    const rows = this.transactions.map(t => [
      t.date,
      `"${(t.description ?? '').replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      `"${(t.category?.name ?? '').replace(/"/g, '""')}"`,
      `"${(t.notes ?? '').replace(/"/g, '""')}"`,
      t.isExecuted
    ].join(','))
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  emptyConvertForm() {
    return { description: '', type: 'Expense', categoryId: undefined as number | undefined, amount: 0, dayOfMonth: 1, notes: '', isActive: true }
  }

  openConvertForm(t: Transaction) {
    const day = parseInt(t.date.split('-')[2], 10)
    this.convertForm = { description: t.description, type: t.type, categoryId: t.categoryId, amount: t.amount, dayOfMonth: day, notes: t.notes, isActive: true }
    this.showConvertModal = true
  }

  saveConvert() {
    this.recurringSvc.create(this.convertForm as any).subscribe(() => {
      this.showConvertModal = false
      this.convertSuccess = true
      setTimeout(() => this.convertSuccess = false, 3000)
    })
  }

  closeConvertModal() { this.showConvertModal = false }

  get totalIncome() { return this.transactions.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0) }
  get totalExpense() { return this.transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0) }
  get totalInvested() { return this.transactions.filter(t => t.type === 'Investment').reduce((s, t) => s + t.amount, 0) }
  get netBalance() { return this.totalIncome - this.totalExpense }

  delete(id: number) {
    if (confirm('Delete this transaction?')) {
      this.svc.delete(id).subscribe(() => this.load())
    }
  }

  deleteAll() {
    if (confirm('Delete all matching transactions? This cannot be undone.')) {
      this.svc.deleteAll(this.filter).subscribe(() => this.load())
    }
  }
}
