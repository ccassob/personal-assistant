import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { TechnologyCategory, TechnologyCategoryService } from '../../core/services/api/technology-category.service'

@Component({
  selector: 'app-technology-categories',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Tech Mastery</h4>
            <button class="btn btn-primary" (click)="openForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Agregar Categoría
            </button>
          </div>
        </div>
      </div>

      <!-- Tech Mastery sub-nav -->
      <div class="row mb-1">
        <div class="col-12">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link" routerLink="/technologies" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Catálogo</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/technology-dashboard" routerLinkActive="active">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/technology-categories" routerLinkActive="active">Categorías</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/technology-audio" routerLinkActive="active">Audios</a>
            </li>
          </ul>
        </div>
      </div>

      @if (categories.length === 0) {
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body text-center text-muted py-5">No hay categorías todavía. Agregá una para empezar.</div>
            </div>
          </div>
        </div>
      }

      <div class="row g-2">
        @for (cat of categories; track cat.id) {
          <div class="col-12">
            <div class="card" style="border-left: 4px solid {{ cat.color }}">
              <div class="card-body py-2 px-3 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2">
                  @if (cat.icon) {
                    <iconify-icon [attr.icon]="cat.icon" width="20" [style.color]="cat.color"></iconify-icon>
                  }
                  <span class="fw-semibold">{{ cat.name }}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <button class="btn btn-sm btn-outline-primary" (click)="openForm(cat)">Editar</button>
                  <button class="btn btn-sm btn-outline-danger" (click)="delete(cat.id)">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Modal -->
    @if (showModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ form.id ? 'Editar' : 'Agregar' }} Categoría</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input class="form-control" [(ngModel)]="form.name" placeholder="e.g. Azure">
              </div>
              <div class="mb-3">
                <label class="form-label">Color</label>
                <input type="color" class="form-control form-control-color" [(ngModel)]="form.color">
              </div>
              <div class="mb-3">
                <label class="form-label">Icono <small class="text-muted">(Iconify, e.g. tabler:brand-azure)</small></label>
                <input class="form-control" [(ngModel)]="form.icon" placeholder="tabler:brand-azure">
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeForm()">Cancelar</button>
              <button class="btn btn-primary" (click)="save()">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class TechnologyCategories implements OnInit {
  categories: TechnologyCategory[] = []
  showModal = false
  form: Partial<TechnologyCategory> = this.emptyForm()

  constructor(private svc: TechnologyCategoryService) {}

  ngOnInit() { this.load() }

  load() {
    this.svc.getAll().subscribe(data => this.categories = data)
  }

  emptyForm() {
    return { name: '', color: '#3b82f6', icon: '' }
  }

  openForm(cat?: TechnologyCategory) {
    this.form = cat ? { ...cat } : this.emptyForm()
    this.showModal = true
  }

  closeForm() { this.showModal = false }

  save() {
    if (this.form.id) {
      this.svc.update(this.form as TechnologyCategory).subscribe(() => { this.load(); this.closeForm() })
    } else {
      this.svc.create(this.form as Omit<TechnologyCategory, 'id'>).subscribe(() => { this.load(); this.closeForm() })
    }
  }

  delete(id: number) {
    if (confirm('¿Eliminar esta categoría? Las tecnologías que la usan quedarán como "Sin categoría".')) {
      this.svc.delete(id).subscribe(() => this.load())
    }
  }
}
