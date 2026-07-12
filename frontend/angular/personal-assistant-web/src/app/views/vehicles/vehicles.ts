import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DecimalPipe } from '@angular/common'
import {
  Vehicle, VehicleMaintenance, VehicleFuel, VehicleMileageHistory,
  VehicleChecklist, VehicleService
} from '../../core/services/api/vehicle.service'
import { AppSettingsService } from '../../core/services/api/app-settings.service'

@Component({
  selector: 'app-vehicles',
  imports: [FormsModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Vehicles</h4>
            <button class="btn btn-primary" (click)="openForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Vehicle
            </button>
          </div>
        </div>
      </div>

      <div class="row g-3">
        @for (v of vehicles; track v.id) {
          <div class="col-12">
            <div class="card">
              <div class="card-body">

                <!-- Header -->
                <div class="d-flex justify-content-between align-items-start mb-1">
                  <h5 class="card-title mb-0">{{ v.name }}</h5>
                  @if (v.licensePlate) {
                    <span class="badge bg-secondary flex-shrink-0 ms-2">{{ v.licensePlate }}</span>
                  }
                </div>
                <div class="text-muted small mb-3">{{ v.year }} · {{ v.make }} {{ v.model }}@if (v.color) { · {{ v.color }}}</div>

                <!-- Stats -->
                <div class="row g-2 mb-3">
                  <div class="col-6 col-md-3">
                    <div class="text-muted small">Current Mileage</div>
                    <div class="fw-semibold">{{ v.currentMileage | number }} {{ distanceUnit }}</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="text-muted small">Maintenance Records</div>
                    <div class="fw-semibold">{{ maintenanceCount(v.id) }}</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="text-muted small">Fuel Records</div>
                    <div class="fw-semibold">{{ fuelCount(v.id) }}</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="text-muted small">Upcoming Reminders</div>
                    <div class="fw-semibold">{{ reminderCount(v.id) - reminderDone(v.id) }} pending</div>
                  </div>
                </div>

                @if (v.notes) {
                  <p class="text-muted small fst-italic mb-3">{{ v.notes }}</p>
                }

                <!-- Update Mileage section -->
                <button class="btn btn-sm btn-outline-primary w-100 d-flex justify-content-between align-items-center mb-2"
                  (click)="toggleUpdateMileage(v)">
                  <span>
                    <iconify-icon icon="tabler:dashboard" width="14" class="me-1"></iconify-icon>
                    Update Mileage
                  </span>
                  <iconify-icon [attr.icon]="expandedUpdateMileage.has(v.id) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                </button>
                @if (expandedUpdateMileage.has(v.id)) {
                  <div class="border rounded p-2 mb-2">
                    <div class="d-flex gap-2 align-items-center">
                      <input type="number" class="form-control form-control-sm"
                        [(ngModel)]="mileageInput[v.id]"
                        min="0"
                        placeholder="{{ v.currentMileage }}">
                      <span class="text-muted small text-nowrap">{{ distanceUnit }}</span>
                      <button class="btn btn-sm btn-primary text-nowrap" (click)="updateMileage(v)">Update</button>
                    </div>
                  </div>
                }

                <!-- Maintenance section -->
                <button class="btn btn-sm btn-outline-warning w-100 d-flex justify-content-between align-items-center mb-2"
                  (click)="toggleMaintenance(v)">
                  <span>
                    <iconify-icon icon="tabler:tool" width="14" class="me-1"></iconify-icon>
                    Maintenance History
                    <span class="badge bg-warning text-dark ms-1" style="font-size:.7rem">{{ maintenanceCount(v.id) }}</span>
                  </span>
                  <iconify-icon [attr.icon]="expandedMaintenance.has(v.id) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                </button>
                @if (expandedMaintenance.has(v.id)) {
                  <div class="border rounded p-2 mb-2">
                    @if (!maintenances.has(v.id)) {
                      <div class="text-muted small text-center py-1">Loading...</div>
                    } @else if ((maintenances.get(v.id) ?? []).length === 0) {
                      <div class="text-muted small text-center py-1">No maintenance records yet.</div>
                    } @else {
                      <div class="table-responsive">
                        <table class="table table-sm table-borderless mb-2">
                          <thead>
                            <tr>
                              <th class="text-muted small ps-0">Date</th>
                              <th class="text-muted small">Type</th>
                              <th class="text-muted small text-end">Mileage</th>
                              <th class="text-muted small text-end">Price</th>
                              <th class="text-muted small text-end pe-0"></th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (m of maintenances.get(v.id) ?? []; track m.id) {
                              <tr>
                                <td class="small ps-0">{{ m.date }}</td>
                                <td class="small">{{ m.type }}</td>
                                <td class="small text-end">{{ m.mileage | number }} {{ distanceUnit }}</td>
                                <td class="small text-end">\${{ m.price | number:'1.2-2' }}</td>
                                <td class="small text-end pe-0 text-nowrap">
                                  <button class="btn btn-link btn-sm p-0 me-1 text-primary" (click)="openMaintenanceForm(v.id, m)">Edit</button>
                                  <button class="btn btn-link btn-sm p-0 text-danger" (click)="deleteMaintenance(v, m)">Delete</button>
                                </td>
                              </tr>
                              @if (m.nextDate || m.nextMileage) {
                                <tr>
                                  <td colspan="5" class="small text-muted pb-1 ps-0" style="font-size:.75rem">
                                    <iconify-icon icon="tabler:clock" width="12" class="me-1"></iconify-icon>
                                    Next:
                                    @if (m.nextDate) { {{ m.nextDate }} }
                                    @if (m.nextDate && m.nextMileage) { · }
                                    @if (m.nextMileage) { {{ m.nextMileage | number }} {{ distanceUnit }} }
                                  </td>
                                </tr>
                              }
                            }
                          </tbody>
                        </table>
                      </div>
                    }
                    <button class="btn btn-sm btn-outline-warning w-100" (click)="openMaintenanceForm(v.id)">
                      <iconify-icon icon="tabler:plus" width="13" class="me-1"></iconify-icon> Add Record
                    </button>
                  </div>
                }

                <!-- Fuel section -->
                <button class="btn btn-sm btn-outline-danger w-100 d-flex justify-content-between align-items-center mb-2"
                  (click)="toggleFuel(v)">
                  <span>
                    <iconify-icon icon="tabler:gas-station" width="14" class="me-1"></iconify-icon>
                    Fuel History
                    <span class="badge bg-danger ms-1" style="font-size:.7rem">{{ fuelCount(v.id) }}</span>
                  </span>
                  <iconify-icon [attr.icon]="expandedFuel.has(v.id) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                </button>
                @if (expandedFuel.has(v.id)) {
                  <div class="border rounded p-2 mb-2">
                    @if (!fuels.has(v.id)) {
                      <div class="text-muted small text-center py-1">Loading...</div>
                    } @else if ((fuels.get(v.id) ?? []).length === 0) {
                      <div class="text-muted small text-center py-1">No fuel records yet.</div>
                    } @else {
                      <div class="table-responsive">
                        <table class="table table-sm table-borderless mb-2">
                          <thead>
                            <tr>
                              <th class="text-muted small ps-0">Date</th>
                              <th class="text-muted small text-end">Total</th>
                              <th class="text-muted small text-end">Gallons</th>
                              <th class="text-muted small text-end">$/gal</th>
                              <th class="text-muted small text-end pe-0"></th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (f of fuels.get(v.id) ?? []; track f.id) {
                              <tr>
                                <td class="small ps-0">{{ f.date }}</td>
                                <td class="small text-end">\${{ f.totalAmount | number:'1.2-2' }}</td>
                                <td class="small text-end">{{ f.gallons | number:'1.3-3' }}</td>
                                <td class="small text-end">\${{ f.pricePerGallon | number:'1.3-3' }}</td>
                                <td class="small text-end pe-0">
                                  <button class="btn btn-link btn-sm p-0 text-danger" (click)="deleteFuel(v, f)">Delete</button>
                                </td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    }
                    <!-- Inline add fuel form -->
                    <div class="border-top pt-2 mt-1">
                      <div class="row g-2 align-items-end">
                        <div class="col-6 col-md-2">
                          <label class="form-label form-label-sm mb-1">Date</label>
                          <input type="date" class="form-control form-control-sm" [(ngModel)]="fuelForm[v.id].date">
                        </div>
                        <div class="col-6 col-md-2">
                          <label class="form-label form-label-sm mb-1">Price/gal ($)</label>
                          <input type="number" class="form-control form-control-sm" [(ngModel)]="fuelForm[v.id].pricePerGallon" min="0" step="0.001">
                        </div>
                        <div class="col-6 col-md-2">
                          <label class="form-label form-label-sm mb-1">Total ($)</label>
                          <input type="number" class="form-control form-control-sm" [(ngModel)]="fuelForm[v.id].totalAmount" min="0" step="0.01">
                        </div>
                        <div class="col-6 col-md-3 d-flex align-items-end gap-2">
                          <span class="text-muted small">≈ {{ calcGallons(v.id) | number:'1.2-2' }} gal</span>
                          <button class="btn btn-sm btn-danger" (click)="addFuel(v)">Add Fuel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                }

                <!-- Mileage History section -->
                <button class="btn btn-sm btn-outline-secondary w-100 d-flex justify-content-between align-items-center mb-2"
                  (click)="toggleMileage(v)">
                  <span>
                    <iconify-icon icon="tabler:road" width="14" class="me-1"></iconify-icon>
                    Mileage History
                    <span class="badge bg-secondary ms-1" style="font-size:.7rem">{{ mileageCount(v.id) }}</span>
                  </span>
                  <iconify-icon [attr.icon]="expandedMileage.has(v.id) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                </button>
                @if (expandedMileage.has(v.id)) {
                  <div class="border rounded p-2 mb-2">
                    @if (!mileageHistories.has(v.id)) {
                      <div class="text-muted small text-center py-1">Loading...</div>
                    } @else if ((mileageHistories.get(v.id) ?? []).length === 0) {
                      <div class="text-muted small text-center py-1">No mileage history yet.</div>
                    } @else {
                      <div class="table-responsive">
                        <table class="table table-sm table-borderless mb-0">
                          <thead>
                            <tr>
                              <th class="text-muted small ps-0">Date</th>
                              <th class="text-muted small text-end pe-0">Mileage</th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (h of mileageHistories.get(v.id) ?? []; track h.id) {
                              <tr>
                                <td class="small ps-0">{{ h.date }}</td>
                                <td class="small text-end pe-0">{{ h.mileage | number }} {{ distanceUnit }}</td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    }
                  </div>
                }

                <!-- Pending Tasks section -->
                <button class="btn btn-sm btn-outline-info w-100 d-flex justify-content-between align-items-center mb-2"
                  (click)="toggleTodos(v)">
                  <span>
                    <iconify-icon icon="tabler:list-check" width="14" class="me-1"></iconify-icon>
                    Pending Tasks
                    <span class="badge bg-info text-dark ms-1" style="font-size:.7rem">
                      {{ todoDone(v.id) }}/{{ todoCount(v.id) }}
                    </span>
                  </span>
                  <iconify-icon [attr.icon]="expandedTodos.has(v.id) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                </button>
                @if (expandedTodos.has(v.id)) {
                  <div class="border rounded p-2 mb-2">
                    @if (!todos.has(v.id)) {
                      <div class="text-muted small text-center py-1">Loading...</div>
                    } @else {
                      @if ((todos.get(v.id) ?? []).length === 0) {
                        <div class="text-muted small text-center py-1">No pending tasks.</div>
                      } @else {
                        <ul class="list-unstyled mb-2">
                          @for (t of todos.get(v.id) ?? []; track t.id) {
                            <li class="d-flex align-items-center gap-2 py-1 border-bottom">
                              <input type="checkbox" class="form-check-input mt-0 flex-shrink-0"
                                [checked]="t.isDone"
                                (change)="toggleTodo(v, t)">
                              <span class="small flex-grow-1"
                                [class.text-decoration-line-through]="t.isDone"
                                [class.text-muted]="t.isDone">{{ t.title }}</span>
                              <button class="btn btn-link btn-sm p-0 text-danger" (click)="deleteTodo(v, t)">Delete</button>
                            </li>
                          }
                        </ul>
                      }
                      <div class="d-flex gap-2 mt-1">
                        <input type="text" class="form-control form-control-sm"
                          [(ngModel)]="newTodoTitle[v.id]"
                          placeholder="New task..."
                          (keyup.enter)="addTodo(v)">
                        <button class="btn btn-sm btn-info text-nowrap" (click)="addTodo(v)">Add</button>
                      </div>
                    }
                  </div>
                }

                <!-- Upcoming Maintenance section -->
                <button class="btn btn-sm btn-outline-success w-100 d-flex justify-content-between align-items-center mb-2"
                  (click)="toggleReminders(v)">
                  <span>
                    <iconify-icon icon="tabler:calendar-check" width="14" class="me-1"></iconify-icon>
                    Upcoming Maintenance
                    <span class="badge bg-success ms-1" style="font-size:.7rem">
                      {{ reminderDone(v.id) }}/{{ reminderCount(v.id) }}
                    </span>
                  </span>
                  <iconify-icon [attr.icon]="expandedReminders.has(v.id) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                </button>
                @if (expandedReminders.has(v.id)) {
                  <div class="border rounded p-2 mb-2">
                    @if (!reminders.has(v.id)) {
                      <div class="text-muted small text-center py-1">Loading...</div>
                    } @else if ((reminders.get(v.id) ?? []).length === 0) {
                      <div class="text-muted small text-center py-1">No upcoming maintenance. Add a maintenance record with a next date or mileage.</div>
                    } @else {
                      <ul class="list-unstyled mb-0">
                        @for (r of reminders.get(v.id) ?? []; track r.id) {
                          <li class="d-flex align-items-center gap-2 py-1 border-bottom">
                            <input type="checkbox" class="form-check-input mt-0 flex-shrink-0"
                              [checked]="r.isDone"
                              (change)="toggleReminder(v, r)">
                            <span class="small flex-grow-1"
                              [class.text-decoration-line-through]="r.isDone"
                              [class.text-muted]="r.isDone">{{ r.title }}</span>
                          </li>
                        }
                      </ul>
                    }
                  </div>
                }

              </div>

              <div class="card-footer d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary flex-fill" (click)="openForm(v)">Edit</button>
                <button class="btn btn-sm btn-outline-danger flex-fill" (click)="delete(v.id)">Delete</button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12 text-center text-muted py-5">No vehicles yet. Add one to start tracking!</div>
        }
      </div>
    </div>

    <!-- Vehicle modal -->
    @if (showModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ form.id ? 'Edit' : 'Add' }} Vehicle</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name <span class="text-muted small">(friendly name)</span></label>
                <input class="form-control" [(ngModel)]="form.name" placeholder="e.g. My Civic">
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Make</label>
                  <input class="form-control" [(ngModel)]="form.make" placeholder="e.g. Honda">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Model</label>
                  <input class="form-control" [(ngModel)]="form.model" placeholder="e.g. Civic">
                </div>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Year</label>
                  <input type="number" class="form-control" [(ngModel)]="form.year" min="1900" [max]="currentYear + 2">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Current Mileage ({{ distanceUnit }})</label>
                  <input type="number" class="form-control" [(ngModel)]="form.currentMileage" min="0">
                </div>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">License Plate <span class="text-muted">(optional)</span></label>
                  <input class="form-control" [(ngModel)]="form.licensePlate" placeholder="e.g. ABC-1234">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Color <span class="text-muted">(optional)</span></label>
                  <input class="form-control" [(ngModel)]="form.color" placeholder="e.g. Silver">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Notes <span class="text-muted">(optional)</span></label>
                <textarea class="form-control" [(ngModel)]="form.notes" rows="2" placeholder="Any additional details..."></textarea>
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

    <!-- Maintenance modal -->
    @if (showMaintenanceModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ maintenanceForm.id ? 'Edit' : 'Add' }} Maintenance Record</h5>
              <button type="button" class="btn-close" (click)="closeMaintenanceForm()"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Date</label>
                  <input type="date" class="form-control" [(ngModel)]="maintenanceForm.date">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Type / Service</label>
                  <input class="form-control" [(ngModel)]="maintenanceForm.type" placeholder="e.g. Oil Change, Tire Rotation">
                </div>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Mileage ({{ distanceUnit }})</label>
                  <input type="number" class="form-control" [(ngModel)]="maintenanceForm.mileage" min="0">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Price</label>
                  <input type="number" class="form-control" [(ngModel)]="maintenanceForm.price" min="0" step="0.01">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Notes <span class="text-muted">(optional)</span></label>
                <textarea class="form-control" [(ngModel)]="maintenanceForm.notes" rows="2" placeholder="Parts replaced, observations..."></textarea>
              </div>
              <hr>
              <div class="text-muted small fw-semibold mb-2">
                <iconify-icon icon="tabler:clock" width="13" class="me-1"></iconify-icon>
                Next Service Reminder <span class="fw-normal">(optional — auto-creates a reminder)</span>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Next Date</label>
                  <input type="date" class="form-control" [(ngModel)]="maintenanceForm.nextDate">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Next Mileage ({{ distanceUnit }})</label>
                  <input type="number" class="form-control" [(ngModel)]="maintenanceForm.nextMileage" min="0" placeholder="e.g. 55000">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeMaintenanceForm()">Cancel</button>
              <button class="btn btn-warning" (click)="saveMaintenance()">Save</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class Vehicles implements OnInit {
  vehicles: Vehicle[] = []
  distanceUnit = 'km'
  currentYear = new Date().getFullYear()

  showModal = false
  form: Partial<Vehicle> = this.emptyForm()

  showMaintenanceModal = false
  maintenanceForm: Partial<VehicleMaintenance> = this.emptyMaintenanceForm()
  activeVehicleId: number | null = null

  expandedUpdateMileage = new Set<number>()
  expandedMaintenance = new Set<number>()
  expandedFuel = new Set<number>()
  expandedMileage = new Set<number>()
  expandedTodos = new Set<number>()
  expandedReminders = new Set<number>()

  maintenances = new Map<number, VehicleMaintenance[]>()
  fuels = new Map<number, VehicleFuel[]>()
  mileageHistories = new Map<number, VehicleMileageHistory[]>()
  todos = new Map<number, VehicleChecklist[]>()
  reminders = new Map<number, VehicleChecklist[]>()

  fuelForm: Record<number, Partial<VehicleFuel>> = {}
  mileageInput: Record<number, number> = {}
  newTodoTitle: Record<number, string> = {}

  constructor(private svc: VehicleService, private settingsSvc: AppSettingsService) {}

  ngOnInit() {
    this.settingsSvc.get().subscribe(s => this.distanceUnit = s.distanceUnit ?? 'km')
    this.load()
  }

  load() {
    this.svc.getAll().subscribe(data => {
      this.vehicles = data
      data.forEach(v => {
        this.svc.getMaintenance(v.id).subscribe(m => this.maintenances.set(v.id, m))
        this.svc.getTodos(v.id).subscribe(t => this.todos.set(v.id, t))
        this.svc.getReminders(v.id).subscribe(r => this.reminders.set(v.id, r))
        this.svc.getFuel(v.id).subscribe(f => this.fuels.set(v.id, f))
      })
    })
  }

  emptyForm(): Partial<Vehicle> {
    return { name: '', make: '', model: '', year: this.currentYear, currentMileage: 0, licensePlate: '', color: '', notes: '' }
  }

  emptyMaintenanceForm(): Partial<VehicleMaintenance> {
    return { date: new Date().toISOString().split('T')[0], mileage: 0, type: '', price: 0, notes: '', nextDate: undefined, nextMileage: undefined }
  }

  emptyFuelForm(): Partial<VehicleFuel> {
    return { date: new Date().toISOString().split('T')[0], pricePerGallon: 0, totalAmount: 0 }
  }

  // ---- Section toggles ----

  toggleUpdateMileage(v: Vehicle) {
    if (this.expandedUpdateMileage.has(v.id)) {
      this.expandedUpdateMileage.delete(v.id)
    } else {
      this.expandedUpdateMileage.add(v.id)
      this.mileageInput[v.id] = v.currentMileage
    }
  }

  updateMileage(v: Vehicle) {
    const newMileage = this.mileageInput[v.id]
    if (newMileage == null || newMileage === v.currentMileage) return
    this.svc.update({ ...v, currentMileage: newMileage }).subscribe(() => {
      this.expandedUpdateMileage.delete(v.id)
      this.svc.getAll().subscribe(data => this.vehicles = data)
      if (this.mileageHistories.has(v.id)) {
        this.svc.getMileageHistory(v.id).subscribe(h => this.mileageHistories.set(v.id, h))
      }
    })
  }

  toggleMaintenance(v: Vehicle) {
    if (this.expandedMaintenance.has(v.id)) {
      this.expandedMaintenance.delete(v.id)
    } else {
      this.expandedMaintenance.add(v.id)
      if (!this.maintenances.has(v.id)) {
        this.svc.getMaintenance(v.id).subscribe(m => this.maintenances.set(v.id, m))
      }
    }
  }

  toggleFuel(v: Vehicle) {
    if (this.expandedFuel.has(v.id)) {
      this.expandedFuel.delete(v.id)
    } else {
      this.expandedFuel.add(v.id)
      if (!this.fuels.has(v.id)) {
        this.svc.getFuel(v.id).subscribe(f => this.fuels.set(v.id, f))
      }
      if (!this.fuelForm[v.id]) {
        this.fuelForm[v.id] = this.emptyFuelForm()
      }
    }
  }

  toggleMileage(v: Vehicle) {
    if (this.expandedMileage.has(v.id)) {
      this.expandedMileage.delete(v.id)
    } else {
      this.expandedMileage.add(v.id)
      if (!this.mileageHistories.has(v.id)) {
        this.svc.getMileageHistory(v.id).subscribe(h => this.mileageHistories.set(v.id, h))
      }
    }
  }

  toggleTodos(v: Vehicle) {
    if (this.expandedTodos.has(v.id)) {
      this.expandedTodos.delete(v.id)
    } else {
      this.expandedTodos.add(v.id)
      if (!this.todos.has(v.id)) {
        this.svc.getTodos(v.id).subscribe(t => this.todos.set(v.id, t))
      }
    }
  }

  toggleReminders(v: Vehicle) {
    if (this.expandedReminders.has(v.id)) {
      this.expandedReminders.delete(v.id)
    } else {
      this.expandedReminders.add(v.id)
      if (!this.reminders.has(v.id)) {
        this.svc.getReminders(v.id).subscribe(r => this.reminders.set(v.id, r))
      }
    }
  }

  // ---- Stats helpers ----

  maintenanceCount(id: number): number { return (this.maintenances.get(id) ?? []).length }
  fuelCount(id: number): number { return (this.fuels.get(id) ?? []).length }
  mileageCount(id: number): number { return (this.mileageHistories.get(id) ?? []).length }
  todoCount(id: number): number { return (this.todos.get(id) ?? []).length }
  todoDone(id: number): number { return (this.todos.get(id) ?? []).filter(t => t.isDone).length }
  reminderCount(id: number): number { return (this.reminders.get(id) ?? []).length }
  reminderDone(id: number): number { return (this.reminders.get(id) ?? []).filter(r => r.isDone).length }

  calcGallons(id: number): number {
    const f = this.fuelForm[id]
    if (!f) return 0
    const price = f.pricePerGallon ?? 0
    const total = f.totalAmount ?? 0
    return price > 0 ? total / price : 0
  }

  // ---- Vehicle CRUD ----

  openForm(v?: Vehicle) {
    this.form = v ? { ...v } : this.emptyForm()
    this.showModal = true
  }

  closeForm() { this.showModal = false }

  save() {
    if (this.form.id) {
      this.svc.update(this.form as Vehicle).subscribe(() => { this.load(); this.closeForm() })
    } else {
      this.svc.create(this.form as Omit<Vehicle, 'id'>).subscribe(() => { this.load(); this.closeForm() })
    }
  }

  delete(id: number) {
    if (confirm('Delete this vehicle and all its records?')) {
      this.svc.delete(id).subscribe(() => this.load())
    }
  }

  // ---- Maintenance CRUD ----

  openMaintenanceForm(vehicleId: number, m?: VehicleMaintenance) {
    this.activeVehicleId = vehicleId
    this.maintenanceForm = m ? { ...m } : this.emptyMaintenanceForm()
    this.showMaintenanceModal = true
  }

  closeMaintenanceForm() { this.showMaintenanceModal = false }

  saveMaintenance() {
    if (this.activeVehicleId === null) return
    const id = this.activeVehicleId
    const f = this.maintenanceForm
    if (!f.nextDate) f.nextDate = undefined
    if (!f.nextMileage) f.nextMileage = undefined

    const reload = () => {
      this.svc.getMaintenance(id).subscribe(m => this.maintenances.set(id, m))
      this.svc.getReminders(id).subscribe(r => this.reminders.set(id, r))
      this.svc.getAll().subscribe(data => this.vehicles = data)
      this.closeMaintenanceForm()
    }

    if (f.id) {
      this.svc.updateMaintenance(id, f.id, f as VehicleMaintenance).subscribe(reload)
    } else {
      this.svc.createMaintenance(id, f as Omit<VehicleMaintenance, 'id' | 'vehicleId'>).subscribe(reload)
    }
  }

  deleteMaintenance(v: Vehicle, m: VehicleMaintenance) {
    this.svc.deleteMaintenance(v.id, m.id).subscribe(() => {
      this.svc.getMaintenance(v.id).subscribe(data => this.maintenances.set(v.id, data))
    })
  }

  // ---- Fuel ----

  addFuel(v: Vehicle) {
    const f = this.fuelForm[v.id]
    if (!f || !f.date || !f.pricePerGallon || !f.totalAmount) return
    this.svc.createFuel(v.id, f as Omit<VehicleFuel, 'id' | 'vehicleId' | 'gallons'>).subscribe(() => {
      this.fuelForm[v.id] = this.emptyFuelForm()
      this.svc.getFuel(v.id).subscribe(data => this.fuels.set(v.id, data))
    })
  }

  deleteFuel(v: Vehicle, f: VehicleFuel) {
    this.svc.deleteFuel(v.id, f.id).subscribe(() => {
      this.svc.getFuel(v.id).subscribe(data => this.fuels.set(v.id, data))
    })
  }

  // ---- Todos ----

  addTodo(v: Vehicle) {
    const title = (this.newTodoTitle[v.id] ?? '').trim()
    if (!title) return
    this.svc.createTodo(v.id, title).subscribe(() => {
      this.newTodoTitle[v.id] = ''
      this.svc.getTodos(v.id).subscribe(t => this.todos.set(v.id, t))
    })
  }

  toggleTodo(v: Vehicle, t: VehicleChecklist) {
    this.svc.toggleTodo(v.id, t.id, !t.isDone).subscribe(() => {
      this.svc.getTodos(v.id).subscribe(data => this.todos.set(v.id, data))
    })
  }

  deleteTodo(v: Vehicle, t: VehicleChecklist) {
    this.svc.deleteTodo(v.id, t.id).subscribe(() => {
      this.svc.getTodos(v.id).subscribe(data => this.todos.set(v.id, data))
    })
  }

  // ---- Reminders ----

  toggleReminder(v: Vehicle, r: VehicleChecklist) {
    this.svc.toggleReminder(v.id, r.id, !r.isDone).subscribe(() => {
      this.svc.getReminders(v.id).subscribe(data => this.reminders.set(v.id, data))
    })
  }
}
