import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Category, CategoryService } from '../../core/services/api/category.service'

@Component({
  selector: 'app-categories',
  imports: [FormsModule],
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

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Color</th>
                    <th>Icon</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (cat of categories; track cat.id) {
                    <tr>
                      <td>{{ cat.name }}</td>
                      <td>
                        <span class="badge" [class.bg-success]="cat.type==='Income'" [class.bg-danger]="cat.type==='Expense'">
                          {{ cat.type }}
                        </span>
                      </td>
                      <td>
                        <span class="d-inline-block rounded" [style.background]="cat.color" style="width:24px;height:24px;border:1px solid #ccc"></span>
                      </td>
                      <td>
                        @if (cat.icon) {
                          <iconify-icon [attr.icon]="cat.icon" width="20"></iconify-icon>
                        }
                        {{ cat.icon }}
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary me-1" (click)="openForm(cat)">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" (click)="delete(cat.id)">Delete</button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="5" class="text-center text-muted py-4">No categories yet. Add one to get started.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
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
