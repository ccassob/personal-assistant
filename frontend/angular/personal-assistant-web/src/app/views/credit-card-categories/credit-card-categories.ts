import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { CreditCardCategoryService, CreditCardCategory } from '../../core/services/api/credit-card-category.service'

@Component({
  selector: 'app-credit-card-categories',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Credit Card Categories</h4>
            <button class="btn btn-primary" (click)="openForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Category
            </button>
          </div>
        </div>
      </div>

      <!-- Credit Cards sub-nav -->
      <div class="row mb-1">
        <div class="col-12">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link" routerLink="/credit-cards" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Credit Cards</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/credit-card-categories" routerLinkActive="active">Categories</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/credit-card-category-limits" routerLinkActive="active">Limits</a>
            </li>
          </ul>
        </div>
      </div>

      @if (categories.length === 0) {
        <div class="row mt-3">
          <div class="col-12">
            <div class="card">
              <div class="card-body text-center text-muted py-5">No categories yet. Add one to get started.</div>
            </div>
          </div>
        </div>
      }

      <div class="row mt-3">
        @for (cat of categories; track cat.id) {
          <div class="col-12 mb-2">
            <div class="card" style="border-left: 4px solid {{ cat.color || '#6c757d' }}">
              <div class="card-body py-2 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-2">
                  @if (cat.icon) {
                    <iconify-icon icon="tabler:{{ cat.icon }}" width="18" [style.color]="cat.color"></iconify-icon>
                  }
                  <span class="fw-semibold">{{ cat.name }}</span>
                </div>
                <div class="d-flex gap-1">
                  <button class="btn btn-sm btn-outline-primary" (click)="openForm(cat)">
                    <iconify-icon icon="tabler:edit" width="14"></iconify-icon> Edit
                  </button>
                  <button class="btn btn-sm btn-outline-danger" (click)="delete(cat.id)">
                    <iconify-icon icon="tabler:trash" width="14"></iconify-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

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
                <input class="form-control" [(ngModel)]="form.name" placeholder="e.g. Restaurants" />
              </div>
              <div class="mb-3">
                <label class="form-label">Color</label>
                <input type="color" class="form-control form-control-color" [(ngModel)]="form.color" />
              </div>
              <div class="mb-3">
                <label class="form-label">Icon (Tabler icon name)</label>
                <input class="form-control" [(ngModel)]="form.icon" placeholder="e.g. credit-card" />
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
  `
})
export class CreditCardCategories implements OnInit {
  categories: CreditCardCategory[] = []
  showModal = false
  form: Partial<CreditCardCategory> = {}

  constructor(private svc: CreditCardCategoryService) {}

  ngOnInit() { this.load() }

  load() { this.svc.getAll().subscribe(c => this.categories = c) }

  openForm(cat?: CreditCardCategory) {
    this.form = cat ? { ...cat } : { name: '', color: '#6c757d', icon: '' }
    this.showModal = true
  }

  closeForm() { this.showModal = false }

  save() {
    if (this.form.id) {
      this.svc.update(this.form as CreditCardCategory).subscribe(() => { this.load(); this.closeForm() })
    } else {
      this.svc.create(this.form as Omit<CreditCardCategory, 'id'>).subscribe(() => { this.load(); this.closeForm() })
    }
  }

  delete(id: number) {
    if (confirm('Delete this category?')) {
      this.svc.delete(id).subscribe({
        next: () => this.load(),
        error: () => alert('Cannot delete: category is in use by one or more transactions.')
      })
    }
  }
}
