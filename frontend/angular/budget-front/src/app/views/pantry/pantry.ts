import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PantryService, PantryItem } from '../../core/services/api/pantry.service'
import { GroceryService, GroceryItem } from '../../core/services/api/grocery.service'

@Component({
  selector: 'app-pantry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
<div class="container-fluid">
  <div class="row mb-3 align-items-center">
    <div class="col">
      <h4 class="mb-0">
        <iconify-icon icon="tabler:fridge" class="me-2"></iconify-icon>
        Pantry
      </h4>
    </div>
    <div class="col-auto">
      <button class="btn btn-primary btn-sm" (click)="openForm()">
        <iconify-icon icon="tabler:plus" class="me-1"></iconify-icon> Add Item
      </button>
    </div>
  </div>

  <!-- Filter pills -->
  <div class="d-flex gap-2 flex-wrap mb-3">
    <button class="btn btn-sm" [class.btn-primary]="activeFilter === 'all'" [class.btn-outline-secondary]="activeFilter !== 'all'" (click)="setFilter('all')">All</button>
    <button class="btn btn-sm" [class.btn-warning]="activeFilter === 'expiring'" [class.btn-outline-secondary]="activeFilter !== 'expiring'" (click)="setFilter('expiring')">
      <iconify-icon icon="tabler:clock-exclamation" class="me-1"></iconify-icon>Expiring Soon
    </button>
    <button class="btn btn-sm" [class.btn-danger]="activeFilter === 'expired'" [class.btn-outline-secondary]="activeFilter !== 'expired'" (click)="setFilter('expired')">
      <iconify-icon icon="tabler:alert-triangle" class="me-1"></iconify-icon>Expired
    </button>
  </div>

  <!-- Summary counts -->
  @if (expiredCount > 0 || expiringCount > 0) {
    <div class="d-flex gap-2 mb-3 flex-wrap">
      @if (expiredCount > 0) {
        <span class="badge bg-danger fs-6">{{ expiredCount }} expired</span>
      }
      @if (expiringCount > 0) {
        <span class="badge bg-warning text-dark fs-6">{{ expiringCount }} expiring soon</span>
      }
    </div>
  }

  <!-- Items list -->
  @if (items.length === 0) {
    <div class="text-center text-muted py-5">
      <iconify-icon icon="tabler:fridge-off" style="font-size:48px"></iconify-icon>
      <p class="mt-2">
        @if (activeFilter === 'all') { No items in your pantry yet. }
        @else if (activeFilter === 'expiring') { No items expiring within 7 days. }
        @else { No expired items. }
      </p>
    </div>
  }

  @for (item of items; track item.id) {
    <div class="card mb-2 border-start border-4" [class.border-danger]="expiryStatus(item) === 'expired'" [class.border-warning]="expiryStatus(item) === 'expiring'" [class.border-success]="expiryStatus(item) === 'fresh'" [class.border-secondary]="expiryStatus(item) === 'none'">
      <div class="card-body py-2">
        <div class="d-flex align-items-start justify-content-between gap-2">
          <div class="flex-grow-1">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <span class="fw-semibold">{{ item.name }}</span>
              <span class="badge bg-secondary small">{{ item.unitType }}</span>
              <span class="fw-bold">{{ item.quantity }} {{ item.unitType === 'Lbs' ? 'lbs' : 'units' }}</span>
            </div>
            <div class="text-muted small mt-1">
              Bought: {{ formatDate(item.purchasedAt) }}
              @if (item.expiresAt) {
                &nbsp;·&nbsp;
                <span [class.text-danger]="expiryStatus(item) === 'expired'" [class.text-warning]="expiryStatus(item) === 'expiring'">
                  @if (expiryStatus(item) === 'expired') {
                    <iconify-icon icon="tabler:alert-triangle" class="me-1"></iconify-icon>Expired: {{ formatDate(item.expiresAt) }}
                  } @else if (expiryStatus(item) === 'expiring') {
                    <iconify-icon icon="tabler:clock-exclamation" class="me-1"></iconify-icon>Expires: {{ formatDate(item.expiresAt) }}
                  } @else {
                    Expires: {{ formatDate(item.expiresAt) }}
                  }
                </span>
              }
            </div>
            @if (item.notes) {
              <div class="text-muted small fst-italic mt-1">{{ item.notes }}</div>
            }
          </div>
        </div>
      </div>
      <div class="card-footer d-flex gap-2 py-1">
        <button class="btn btn-outline-success btn-sm flex-fill" (click)="openConsume(item)">
          <iconify-icon icon="tabler:minus" class="me-1"></iconify-icon>Use Some
        </button>
        <button class="btn btn-success btn-sm flex-fill" (click)="useAll(item)">
          <iconify-icon icon="tabler:check" class="me-1"></iconify-icon>Use All
        </button>
        <button class="btn btn-outline-secondary btn-sm flex-fill" (click)="openForm(item)">
          <iconify-icon icon="tabler:pencil" class="me-1"></iconify-icon>Edit
        </button>
        <button class="btn btn-outline-danger btn-sm flex-fill" (click)="deleteItem(item)">
          <iconify-icon icon="tabler:trash" class="me-1"></iconify-icon>Delete
        </button>
      </div>
    </div>
  }
</div>

<!-- Add/Edit Modal -->
@if (showModal) {
  <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5)">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editId ? 'Edit Item' : 'Add Pantry Item' }}</h5>
          <button type="button" class="btn-close" (click)="closeForm()"></button>
        </div>
        <div class="modal-body">
          <!-- Catalog picker -->
          <div class="mb-3">
            <label class="form-label">Link to catalog (optional)</label>
            <select class="form-select" [(ngModel)]="selectedGroceryItemId" (ngModelChange)="onGroceryItemSelected($event)">
              <option [ngValue]="null">-- None (enter manually) --</option>
              @for (gi of groceryItems; track gi.id) {
                <option [ngValue]="gi.id">{{ gi.name }}</option>
              }
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Name <span class="text-danger">*</span></label>
            <input class="form-control" [(ngModel)]="form.name" [disabled]="!!selectedGroceryItemId" placeholder="Product name" />
          </div>
          <div class="row g-2 mb-3">
            <div class="col">
              <label class="form-label">Quantity <span class="text-danger">*</span></label>
              <input type="number" class="form-control" [(ngModel)]="form.quantity" min="0" step="0.01" />
            </div>
            <div class="col">
              <label class="form-label">Unit Type</label>
              <select class="form-select" [(ngModel)]="form.unitType" [disabled]="!!selectedGroceryItemId">
                <option value="Units">Units</option>
                <option value="Lbs">Lbs</option>
              </select>
            </div>
          </div>
          <div class="row g-2 mb-3">
            <div class="col">
              <label class="form-label">Purchased <span class="text-danger">*</span></label>
              <input type="date" class="form-control" [(ngModel)]="form.purchasedAt" />
            </div>
            <div class="col">
              <label class="form-label">Expires (optional)</label>
              <input type="date" class="form-control" [(ngModel)]="form.expiresAt" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Notes</label>
            <input class="form-control" [(ngModel)]="form.notes" placeholder="Optional note" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeForm()">Cancel</button>
          <button class="btn btn-primary" (click)="saveForm()" [disabled]="!form.name || !form.quantity || !form.purchasedAt">Save</button>
        </div>
      </div>
    </div>
  </div>
}

<!-- Consume Modal -->
@if (showConsumeModal) {
  <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5)">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Use: {{ consumeItem?.name }}</h5>
          <button type="button" class="btn-close" (click)="showConsumeModal = false"></button>
        </div>
        <div class="modal-body">
          <p class="text-muted small">Remaining: {{ consumeItem?.quantity }} {{ consumeItem?.unitType === 'Lbs' ? 'lbs' : 'units' }}</p>
          <label class="form-label">Amount to use <span class="text-danger">*</span></label>
          <input type="number" class="form-control" [(ngModel)]="consumeAmount" min="0.01" step="0.01" [max]="consumeItem?.quantity ?? 9999" />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showConsumeModal = false">Cancel</button>
          <button class="btn btn-success" (click)="confirmConsume()" [disabled]="!consumeAmount || consumeAmount <= 0">Confirm</button>
        </div>
      </div>
    </div>
  </div>
}
  `
})
export class Pantry implements OnInit {
  items: PantryItem[] = []
  groceryItems: GroceryItem[] = []
  activeFilter: 'all' | 'expiring' | 'expired' = 'all'

  showModal = false
  editId: number | null = null
  selectedGroceryItemId: number | null = null
  form: Partial<PantryItem> = {}

  showConsumeModal = false
  consumeItem: PantryItem | null = null
  consumeAmount = 0

  constructor(private svc: PantryService, private grocerySvc: GroceryService) {}

  ngOnInit() {
    this.load()
    this.grocerySvc.getItems().subscribe(items => this.groceryItems = items)
  }

  load() {
    const filter = this.activeFilter === 'all' ? undefined : this.activeFilter
    this.svc.getItems(filter).subscribe(items => this.items = items)
  }

  get expiredCount() {
    const today = new Date(); today.setHours(0,0,0,0)
    return this.items.filter(i => i.expiresAt && new Date(i.expiresAt) < today).length
  }

  get expiringCount() {
    const today = new Date(); today.setHours(0,0,0,0)
    const in7 = new Date(today); in7.setDate(in7.getDate() + 7)
    return this.items.filter(i => i.expiresAt && new Date(i.expiresAt) >= today && new Date(i.expiresAt) <= in7).length
  }

  setFilter(f: 'all' | 'expiring' | 'expired') {
    this.activeFilter = f
    this.load()
  }

  expiryStatus(item: PantryItem): 'expired' | 'expiring' | 'fresh' | 'none' {
    if (!item.expiresAt) return 'none'
    const today = new Date(); today.setHours(0,0,0,0)
    const exp = new Date(item.expiresAt)
    const in7 = new Date(today); in7.setDate(in7.getDate() + 7)
    if (exp < today) return 'expired'
    if (exp <= in7) return 'expiring'
    return 'fresh'
  }

  formatDate(d?: string): string {
    if (!d) return ''
    const dt = new Date(d + (d.length === 10 ? 'T00:00:00' : ''))
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  openForm(item?: PantryItem) {
    this.editId = item?.id ?? null
    this.selectedGroceryItemId = item?.groceryItemId ?? null
    this.form = item ? {
      name: item.name,
      quantity: item.quantity,
      unitType: item.unitType,
      purchasedAt: item.purchasedAt,
      expiresAt: item.expiresAt,
      notes: item.notes,
      groceryItemId: item.groceryItemId
    } : {
      name: '',
      quantity: 1,
      unitType: 'Units',
      purchasedAt: new Date().toISOString().slice(0, 10),
      expiresAt: undefined,
      notes: ''
    }
    this.showModal = true
  }

  closeForm() {
    this.showModal = false
    this.editId = null
    this.selectedGroceryItemId = null
  }

  onGroceryItemSelected(id: number | null) {
    if (!id) {
      this.form.name = ''
      this.form.unitType = 'Units'
      this.form.groceryItemId = undefined
      return
    }
    const gi = this.groceryItems.find(g => g.id === id)
    if (gi) {
      this.form.name = gi.name
      this.form.unitType = gi.unitType
      this.form.groceryItemId = gi.id
    }
  }

  saveForm() {
    const payload = { ...this.form, groceryItemId: this.selectedGroceryItemId ?? undefined }
    if (this.editId) {
      this.svc.updateItem(this.editId, payload).subscribe(() => { this.closeForm(); this.load() })
    } else {
      this.svc.createItem(payload).subscribe(() => { this.closeForm(); this.load() })
    }
  }

  deleteItem(item: PantryItem) {
    if (!confirm(`Delete "${item.name}"?`)) return
    this.svc.deleteItem(item.id).subscribe(() => this.load())
  }

  openConsume(item: PantryItem) {
    this.consumeItem = item
    this.consumeAmount = 1
    this.showConsumeModal = true
  }

  confirmConsume() {
    if (!this.consumeItem) return
    this.svc.consume(this.consumeItem.id, this.consumeAmount).subscribe(() => {
      this.showConsumeModal = false
      this.consumeItem = null
      this.load()
    })
  }

  useAll(item: PantryItem) {
    if (!confirm(`Mark all ${item.quantity} ${item.unitType === 'Lbs' ? 'lbs' : 'units'} of "${item.name}" as used?`)) return
    this.svc.consume(item.id, item.quantity).subscribe(() => this.load())
  }
}
