import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DecimalPipe } from '@angular/common'
import { Goal, GoalService } from '../../core/services/api/goal.service'

@Component({
  selector: 'app-goals',
  imports: [FormsModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Goals</h4>
            <button class="btn btn-primary" (click)="openForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Goal
            </button>
          </div>
        </div>
      </div>

      <div class="row g-3">
        @for (g of goals; track g.id) {
          <div class="col-md-6 col-xl-4">
            <div class="card h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title mb-0">{{ g.name }}</h5>
                  <span class="badge" [class.bg-success]="g.status==='Completed'" [class.bg-warning]="g.status==='Paused'" [class.bg-primary]="g.status==='Active'">
                    {{ g.status }}
                  </span>
                </div>
                @if (g.description) {
                  <p class="text-muted small mb-2">{{ g.description }}</p>
                }
                <div class="mb-1 d-flex justify-content-between">
                  <small>{{ g.currentAmount | number:'1.2-2' }} / {{ g.targetAmount | number:'1.2-2' }}</small>
                  <small>{{ pct(g) | number:'1.0-0' }}%</small>
                </div>
                <div class="progress mb-2" style="height:8px">
                  <div class="progress-bar bg-primary" [style.width.%]="pct(g) > 100 ? 100 : pct(g)"></div>
                </div>
                <small class="text-muted">Deadline: {{ g.deadline }}</small>
              </div>
              <div class="card-footer d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary flex-fill" (click)="openForm(g)">Edit</button>
                <button class="btn btn-sm btn-outline-danger flex-fill" (click)="delete(g.id)">Delete</button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12 text-center text-muted py-5">No goals yet. Add one to start tracking your savings!</div>
        }
      </div>
    </div>

    @if (showModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ form.id ? 'Edit' : 'Add' }} Goal</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input class="form-control" [(ngModel)]="form.name">
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" [(ngModel)]="form.description" rows="2"></textarea>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Target Amount</label>
                  <input type="number" class="form-control" [(ngModel)]="form.targetAmount" min="0" step="0.01">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Current Amount</label>
                  <input type="number" class="form-control" [(ngModel)]="form.currentAmount" min="0" step="0.01">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Deadline</label>
                <input type="date" class="form-control" [(ngModel)]="form.deadline">
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" [(ngModel)]="form.status">
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
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
export class Goals implements OnInit {
  goals: Goal[] = []
  showModal = false
  form: Partial<Goal> = this.emptyForm()

  constructor(private svc: GoalService) {}

  ngOnInit() { this.load() }

  load() { this.svc.getAll().subscribe(data => this.goals = data) }

  pct(g: Goal) {
    return g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0
  }

  emptyForm(): Partial<Goal> {
    const deadline = new Date()
    deadline.setFullYear(deadline.getFullYear() + 1)
    return { name: '', description: '', targetAmount: 0, currentAmount: 0, deadline: deadline.toISOString().split('T')[0], status: 'Active' }
  }

  openForm(g?: Goal) {
    this.form = g ? { ...g } : this.emptyForm()
    this.showModal = true
  }

  closeForm() { this.showModal = false }

  save() {
    if (this.form.id) {
      this.svc.update(this.form as Goal).subscribe(() => { this.load(); this.closeForm() })
    } else {
      this.svc.create(this.form as Omit<Goal, 'id'>).subscribe(() => { this.load(); this.closeForm() })
    }
  }

  delete(id: number) {
    if (confirm('Delete this goal?')) {
      this.svc.delete(id).subscribe(() => this.load())
    }
  }
}
