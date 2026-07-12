import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Category, CategoryService } from '../../core/services/api/category.service'

@Component({
  selector: 'app-categories',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Categories</h4>
            <button class="btn btn-primary" (click)="openForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Category
            </button>
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

      @if (categories.length === 0) {
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body text-center text-muted py-5">No categories yet. Add one to get started.</div>
            </div>
          </div>
        </div>
      }

      <!-- Income -->
      @if (income.length > 0) {
        <h6 class="text-muted text-uppercase small fw-semibold mb-2 px-1">Income</h6>
        <div class="row g-2 mb-3">
          @for (cat of income; track cat.id) {
            <div class="col-12">
              <div class="card" style="border-left: 4px solid {{ cat.color }}">
                <div class="card-body py-2 px-3 d-flex align-items-center justify-content-between">
                  <span class="fw-semibold">{{ cat.name }}</span>
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-success">Income</span>
                    <button class="btn btn-sm btn-outline-primary" (click)="openForm(cat)">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" (click)="delete(cat.id)">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Expense -->
      @if (expense.length > 0) {
        <h6 class="text-muted text-uppercase small fw-semibold mb-2 px-1">Expense</h6>
        <div class="row g-2 mb-3">
          @for (cat of expense; track cat.id) {
            <div class="col-12">
              <div class="card" style="border-left: 4px solid {{ cat.color }}">
                <div class="card-body py-2 px-3 d-flex align-items-center justify-content-between">
                  <span class="fw-semibold">{{ cat.name }}</span>
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-danger">Expense</span>
                    <button class="btn btn-sm btn-outline-primary" (click)="openForm(cat)">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" (click)="delete(cat.id)">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Investment -->
      @if (investment.length > 0) {
        <h6 class="text-muted text-uppercase small fw-semibold mb-2 px-1">Investment</h6>
        <div class="row g-2">
          @for (cat of investment; track cat.id) {
            <div class="col-12">
              <div class="card" style="border-left: 4px solid {{ cat.color }}">
                <div class="card-body py-2 px-3 d-flex align-items-center justify-content-between">
                  <span class="fw-semibold">{{ cat.name }}</span>
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge" style="background:#6610f2">Investment</span>
                    <button class="btn btn-sm btn-outline-primary" (click)="openForm(cat)">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" (click)="delete(cat.id)">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Modal -->
    @if (showModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ form.id ? 'Edit' : 'Add' }} Category</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input class="form-control" [(ngModel)]="form.name" required>
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
                <label class="form-label">Color</label>
                <input type="color" class="form-control form-control-color" [(ngModel)]="form.color">
              </div>
              <div class="mb-3">
                <label class="form-label">Icon <small class="text-muted">(Iconify, e.g. tabler:home)</small></label>
                <input class="form-control" [(ngModel)]="form.icon" placeholder="tabler:home">
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
export class Categories implements OnInit {
  categories: Category[] = []
  showModal = false
  form: Partial<Category> & { id?: number } = this.emptyForm()

  get income() { return this.categories.filter(c => c.type === 'Income') }
  get expense() { return this.categories.filter(c => c.type === 'Expense') }
  get investment() { return this.categories.filter(c => c.type === 'Investment') }

  constructor(private svc: CategoryService) {}

  ngOnInit() { this.load() }

  load() {
    this.svc.getAll().subscribe(data => this.categories = data)
  }

  emptyForm() {
    return { name: '', type: 'Expense', color: '#3b82f6', icon: '' }
  }

  openForm(cat?: Category) {
    this.form = cat ? { ...cat } : this.emptyForm()
    this.showModal = true
  }

  closeForm() { this.showModal = false }

  save() {
    if (this.form.id) {
      this.svc.update(this.form as Category).subscribe(() => { this.load(); this.closeForm() })
    } else {
      this.svc.create(this.form as Omit<Category, 'id'>).subscribe(() => { this.load(); this.closeForm() })
    }
  }

  delete(id: number) {
    if (confirm('Delete this category?')) {
      this.svc.delete(id).subscribe(() => this.load())
    }
  }
}
