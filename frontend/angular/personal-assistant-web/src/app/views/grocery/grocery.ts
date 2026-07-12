import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { forkJoin } from 'rxjs'
import {
  GroceryService,
  GroceryCategory,
  Supermarket,
  GroceryItem,
  GroceryPurchase,
} from '../../core/services/api/grocery.service'
import { PantryService } from '../../core/services/api/pantry.service'

@Component({
  selector: 'app-grocery',
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">

      <!-- Page header -->
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title mb-0">
              <iconify-icon icon="tabler:shopping-cart" width="22" class="me-1"></iconify-icon>
              Grocery
            </h4>
            <button class="btn btn-primary" (click)="openItemForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Item
            </button>
          </div>
        </div>
      </div>

      <!-- Tab bar -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="btn-group w-100" role="group">
            <button class="btn" [class.btn-primary]="activeTab==='list'" [class.btn-outline-secondary]="activeTab!=='list'" (click)="activeTab='list'">
              <iconify-icon icon="tabler:list-check" width="15" class="me-1"></iconify-icon> Shopping List
            </button>
            <button class="btn" [class.btn-primary]="activeTab==='items'" [class.btn-outline-secondary]="activeTab!=='items'" (click)="activeTab='items'">
              <iconify-icon icon="tabler:package" width="15" class="me-1"></iconify-icon> All Items
            </button>
            <button class="btn" [class.btn-primary]="activeTab==='history'" [class.btn-outline-secondary]="activeTab!=='history'" (click)="activeTab='history'">
              <iconify-icon icon="tabler:history" width="15" class="me-1"></iconify-icon> History
            </button>
          </div>
        </div>
      </div>

      <!-- ─── TAB 1: SHOPPING LIST ─── -->
      @if (activeTab === 'list') {

        <!-- Supermarket filter pills -->
        <div class="d-flex gap-2 flex-wrap mb-3">
          <button class="btn btn-sm" [class.btn-primary]="selectedSupermarketId === null" [class.btn-outline-primary]="selectedSupermarketId !== null"
            (click)="selectSupermarket(null)">
            <iconify-icon icon="tabler:building-store" width="13" class="me-1"></iconify-icon> All
          </button>
          @for (s of supermarkets; track s.id) {
            <button class="btn btn-sm" [class.btn-primary]="selectedSupermarketId === s.id" [class.btn-outline-primary]="selectedSupermarketId !== s.id"
              (click)="selectSupermarket(s.id)">
              {{ s.name }}
            </button>
          }
        </div>

        <!-- Grouped by category -->
        @if (listItems.length === 0) {
          <div class="text-center text-muted py-5">
            <iconify-icon icon="tabler:shopping-cart-off" width="48" class="d-block mx-auto mb-2 opacity-25"></iconify-icon>
            @if (selectedSupermarketId) {
              <div>No items from this supermarket on your list.</div>
            } @else {
              <div>Your shopping list is empty.</div>
              <div class="small mt-1">Go to "All Items" and toggle items on list.</div>
            }
          </div>
        } @else {
          @for (group of listGroups; track group.label) {
            <div class="mb-1">
              <div class="d-flex align-items-center mb-1 px-1">
                <span class="badge bg-{{ group.color }} me-2" style="font-size:.7rem">{{ group.label }}</span>
                <small class="text-muted">{{ group.items.length }} item{{ group.items.length !== 1 ? 's' : '' }}</small>
              </div>
              @for (item of group.items; track item.id) {
                <div class="card mb-2">
                  <div class="card-body py-2">
                    <div class="d-flex align-items-center gap-2">
                      <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-1 flex-wrap">
                          <span class="fw-semibold">{{ item.name }}</span>
                          <span class="badge bg-secondary" style="font-size:.65rem">{{ item.unitType }}</span>
                        </div>
                        @if (item.manufacturer || item.barcode) {
                          <div class="d-flex align-items-center gap-1 flex-wrap mt-1">
                            @if (item.manufacturer) {
                              <span class="text-muted small">{{ item.manufacturer }}</span>
                            }
                            @if (item.barcode) {
                              <span class="badge bg-light text-dark border" style="font-size:.65rem">
                                <iconify-icon icon="tabler:barcode" width="11"></iconify-icon> {{ item.barcode }}
                              </span>
                            }
                          </div>
                        }
                        <div class="text-muted mt-1" style="font-size:.72rem">
                          @if (item.lastPrice && item.lastQuantity) {
                            {{ fmtPrice(item.lastPrice) }} &middot; {{ item.lastQuantity }} {{ item.unitType === 'Lbs' ? 'lbs' : 'unit' }}
                          } @else {
                            no purchase history
                          }
                        </div>
                      </div>
                      <div class="flex-shrink-0">
                        <button class="btn btn-success btn-sm" (click)="openPurchaseModal(item)">
                          <iconify-icon icon="tabler:check" width="14"></iconify-icon> Buy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        }
      }

      <!-- ─── TAB 2: ALL ITEMS ─── -->
      @if (activeTab === 'items') {

        <!-- Management panels -->
        <div class="row g-2 mb-3">
          <!-- Categories -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-body py-2">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-semibold small">Categories</span>
                  <button class="btn btn-sm btn-link p-0 text-decoration-none" (click)="showCategories = !showCategories">
                    <iconify-icon [attr.icon]="showCategories ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                  </button>
                </div>
                @if (showCategories) {
                  <div class="mt-2 d-flex flex-wrap gap-1 align-items-center">
                    @for (c of categories; track c.id) {
                      <span class="badge bg-{{ c.color }} {{ c.color === 'warning' ? 'text-dark' : '' }} d-inline-flex align-items-center gap-1">
                        {{ c.name }}
                        <button class="btn btn-link p-0 ms-1" style="line-height:1;color:inherit;font-size:.7rem" (click)="openCategoryForm(c)">
                          <iconify-icon icon="tabler:pencil" width="11"></iconify-icon>
                        </button>
                        <button class="btn btn-link p-0 ms-1" style="line-height:1;color:inherit;font-size:.7rem" (click)="deleteCategory(c)">
                          <iconify-icon icon="tabler:x" width="11"></iconify-icon>
                        </button>
                      </span>
                    }
                    <button class="btn btn-sm btn-outline-secondary py-0 px-1" style="font-size:.75rem" (click)="openCategoryForm()">
                      + Add
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
          <!-- Supermarkets -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-body py-2">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-semibold small">Supermarkets</span>
                  <button class="btn btn-sm btn-link p-0 text-decoration-none" (click)="showSupermarkets = !showSupermarkets">
                    <iconify-icon [attr.icon]="showSupermarkets ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                  </button>
                </div>
                @if (showSupermarkets) {
                  <div class="mt-2 d-flex flex-wrap gap-1 align-items-center">
                    @for (s of supermarkets; track s.id) {
                      <span class="badge bg-light text-dark border d-inline-flex align-items-center gap-1">
                        <iconify-icon icon="tabler:building-store" width="11"></iconify-icon>
                        {{ s.name }}
                        <button class="btn btn-link p-0 ms-1 text-dark" style="line-height:1;font-size:.7rem" (click)="openSupermarketForm(s)">
                          <iconify-icon icon="tabler:pencil" width="11"></iconify-icon>
                        </button>
                        <button class="btn btn-link p-0 ms-1 text-danger" style="line-height:1;font-size:.7rem" (click)="deleteSupermarket(s)">
                          <iconify-icon icon="tabler:x" width="11"></iconify-icon>
                        </button>
                      </span>
                    }
                    <button class="btn btn-sm btn-outline-secondary py-0 px-1" style="font-size:.75rem" (click)="openSupermarketForm()">
                      + Add
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Item cards -->
        @if (allItems.length === 0) {
          <div class="text-center text-muted py-5">
            <iconify-icon icon="tabler:package-off" width="48" class="d-block mx-auto mb-2 opacity-25"></iconify-icon>
            No products yet. Click "+ Add Item" to start.
          </div>
        } @else {
          @for (item of allItems; track item.id) {
            <div class="card mb-2">
              <div class="card-body">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-start mb-1">
                  <div class="d-flex align-items-center gap-1 flex-wrap">
                    <span class="fw-semibold">{{ item.name }}</span>
                    <span class="badge bg-secondary" style="font-size:.65rem">{{ item.unitType }}</span>
                  </div>
                  @if (categoryMap[item.groceryCategoryId ?? 0]) {
                    <span class="badge bg-{{ categoryMap[item.groceryCategoryId!].color }} {{ categoryMap[item.groceryCategoryId!].color === 'warning' ? 'text-dark' : '' }} ms-2 flex-shrink-0" style="font-size:.65rem">
                      {{ categoryMap[item.groceryCategoryId!].name }}
                    </span>
                  }
                </div>
                @if (item.manufacturer) {
                  <div class="text-muted small">{{ item.manufacturer }}</div>
                }
                @if (item.barcode) {
                  <div class="text-muted small">
                    <iconify-icon icon="tabler:barcode" width="13" class="me-1"></iconify-icon>{{ item.barcode }}
                  </div>
                }
                <!-- Supermarket chips -->
                @if (item.supermarketIds.length > 0) {
                  <div class="d-flex flex-wrap gap-1 mt-1">
                    @for (sid of item.supermarketIds; track sid) {
                      @if (supermarketMap[sid]) {
                        <span class="badge bg-light text-dark border" style="font-size:.65rem">
                          <iconify-icon icon="tabler:building-store" width="11" class="me-1"></iconify-icon>{{ supermarketMap[sid].name }}
                        </span>
                      }
                    }
                  </div>
                }
                <!-- Last purchase -->
                @if (item.lastPrice && item.lastQuantity && item.lastSupermarketId) {
                  <div class="text-muted fst-italic mt-1" style="font-size:.72rem">
                    Last: {{ fmtPrice(item.lastPrice) }} &middot; {{ item.lastQuantity }} {{ item.unitType === 'Lbs' ? 'lbs' : 'unit' }}
                    @if (supermarketMap[item.lastSupermarketId]) {
                      &middot; {{ supermarketMap[item.lastSupermarketId].name }}
                    }
                  </div>
                }
              </div>
              <div class="card-footer d-flex gap-2">
                @if (item.isOnList) {
                  <button class="btn btn-success btn-sm flex-fill" (click)="toggleList(item)">
                    <iconify-icon icon="tabler:shopping-cart" width="14"></iconify-icon> On List
                  </button>
                } @else {
                  <button class="btn btn-outline-primary btn-sm flex-fill" (click)="toggleList(item)">
                    <iconify-icon icon="tabler:shopping-cart-plus" width="14"></iconify-icon> Add to List
                  </button>
                }
                <button class="btn btn-outline-secondary btn-sm flex-fill" (click)="openItemForm(item)">Edit</button>
                <button class="btn btn-outline-danger btn-sm flex-fill" (click)="deleteItem(item)">Delete</button>
              </div>
            </div>
          }
        }
      }

      <!-- ─── TAB 3: HISTORY ─── -->
      @if (activeTab === 'history') {
        @if (purchases.length === 0) {
          <div class="text-center text-muted py-5">
            <iconify-icon icon="tabler:receipt-off" width="48" class="d-block mx-auto mb-2 opacity-25"></iconify-icon>
            No purchases recorded yet.
          </div>
        } @else {
          <div class="card">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-sm table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="ps-3">Date / Time</th>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Supermarket</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (p of purchases; track p.id) {
                      <tr>
                        <td class="ps-3 small text-muted text-nowrap">{{ formatDate(p.purchasedAt) }}</td>
                        <td class="small">{{ itemMap[p.groceryItemId]?.name ?? '—' }}</td>
                        <td class="small text-nowrap">{{ p.quantity }} {{ itemMap[p.groceryItemId]?.unitType === 'Lbs' ? 'lbs' : 'unit' }}</td>
                        <td class="small text-nowrap">{{ '$' + p.price.toFixed(2) }}</td>
                        <td class="small">{{ supermarketMap[p.supermarketId]?.name ?? '—' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      }

    </div>

    <!-- ─── PURCHASE MODAL ─── -->
    @if (showPurchaseModal && purchaseItem) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Mark as Purchased</h5>
              <button type="button" class="btn-close" (click)="closePurchaseModal()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <div class="fw-semibold">{{ purchaseItem.name }}</div>
                <div class="text-muted small">{{ purchaseItem.manufacturer ? purchaseItem.manufacturer + ' · ' : '' }}{{ purchaseItem.unitType }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Supermarket *</label>
                <select class="form-select" [(ngModel)]="purchaseForm.supermarketId">
                  <option [ngValue]="0" disabled>Select supermarket</option>
                  @for (s of supermarkets; track s.id) {
                    <option [ngValue]="s.id">{{ s.name }}</option>
                  }
                </select>
              </div>
              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label">Price ($) *</label>
                  <input type="number" class="form-control" [(ngModel)]="purchaseForm.price" min="0" step="0.01">
                </div>
                <div class="col-6">
                  <label class="form-label">Quantity *</label>
                  <input type="number" class="form-control" [(ngModel)]="purchaseForm.quantity" min="0" step="0.01">
                </div>
              </div>
              <div class="text-muted small mb-3">
                <iconify-icon icon="tabler:calendar" width="13" class="me-1"></iconify-icon>
                {{ purchaseForm.purchasedAtDisplay }}
              </div>
              <hr class="my-2">
              <div class="form-check mb-2">
                <input type="checkbox" class="form-check-input" id="addToPantry" [(ngModel)]="purchaseForm.addToPantry">
                <label class="form-check-label" for="addToPantry">
                  <iconify-icon icon="tabler:fridge" width="14" class="me-1"></iconify-icon>Add to pantry
                </label>
              </div>
              @if (purchaseForm.addToPantry) {
                <div class="mb-2">
                  <label class="form-label small mb-1">Expiration date (optional)</label>
                  <input type="date" class="form-control form-control-sm" [(ngModel)]="purchaseForm.expiresAt">
                </div>
              }
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closePurchaseModal()">Cancel</button>
              <button class="btn btn-success" (click)="confirmPurchase()">
                <iconify-icon icon="tabler:check" width="14"></iconify-icon> Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- ─── ITEM CREATE/EDIT MODAL ─── -->
    @if (showItemModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ itemForm.id ? 'Edit' : 'Add' }} Item</h5>
              <button type="button" class="btn-close" (click)="closeItemForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name *</label>
                <input class="form-control" [(ngModel)]="itemForm.name" placeholder="e.g. Whole Milk">
              </div>
              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label">Manufacturer</label>
                  <input class="form-control" [(ngModel)]="itemForm.manufacturer" placeholder="e.g. Parmalat">
                </div>
                <div class="col-6">
                  <label class="form-label">Barcode</label>
                  <input class="form-control" [(ngModel)]="itemForm.barcode" placeholder="e.g. 7501008932">
                </div>
              </div>
              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label">Category</label>
                  <select class="form-select" [(ngModel)]="itemForm.groceryCategoryId">
                    <option [ngValue]="undefined">— None —</option>
                    @for (c of categories; track c.id) {
                      <option [ngValue]="c.id">{{ c.name }}</option>
                    }
                  </select>
                </div>
                <div class="col-6">
                  <label class="form-label">Unit Type</label>
                  <select class="form-select" [(ngModel)]="itemForm.unitType">
                    <option value="Units">Units</option>
                    <option value="Lbs">Lbs</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Supermarkets (where this product is sold)</label>
                <div class="d-flex flex-wrap gap-2">
                  @for (s of supermarkets; track s.id) {
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="checkbox" [id]="'sm-' + s.id"
                        [checked]="itemFormSupermarkets.has(s.id)"
                        (change)="toggleItemSupermarket(s.id)">
                      <label class="form-check-label small" [for]="'sm-' + s.id">{{ s.name }}</label>
                    </div>
                  }
                  @if (supermarkets.length === 0) {
                    <span class="text-muted small">No supermarkets yet. Add one in All Items tab.</span>
                  }
                </div>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="isOnList" [(ngModel)]="itemForm.isOnList">
                <label class="form-check-label" for="isOnList">Add to shopping list</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeItemForm()">Cancel</button>
              <button class="btn btn-primary" (click)="saveItem()">Save</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- ─── CATEGORY MODAL ─── -->
    @if (showCategoryModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ categoryForm.id ? 'Edit' : 'Add' }} Category</h5>
              <button type="button" class="btn-close" (click)="closeCategoryForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name *</label>
                <input class="form-control" [(ngModel)]="categoryForm.name" placeholder="e.g. Dairy">
              </div>
              <div>
                <label class="form-label">Color</label>
                <div class="d-flex gap-2 flex-wrap">
                  @for (col of colorOptions; track col.value) {
                    <button type="button" class="btn btn-sm rounded-circle p-0"
                      [class]="'btn-' + col.value"
                      style="width:28px;height:28px;"
                      [style.outline]="categoryForm.color === col.value ? '2px solid #333' : 'none'"
                      [style.outlineOffset]="'2px'"
                      (click)="categoryForm.color = col.value">
                    </button>
                  }
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeCategoryForm()">Cancel</button>
              <button class="btn btn-primary" (click)="saveCategory()">Save</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- ─── SUPERMARKET MODAL ─── -->
    @if (showSupermarketModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ supermarketForm.id ? 'Edit' : 'Add' }} Supermarket</h5>
              <button type="button" class="btn-close" (click)="closeSupermarketForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name *</label>
                <input class="form-control" [(ngModel)]="supermarketForm.name" placeholder="e.g. Walmart">
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeSupermarketForm()">Cancel</button>
              <button class="btn btn-primary" (click)="saveSupermarket()">Save</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class Grocery implements OnInit {
  activeTab = 'list'
  selectedSupermarketId: number | null = null

  categories: GroceryCategory[] = []
  supermarkets: Supermarket[] = []
  allItems: GroceryItem[] = []
  listItems: GroceryItem[] = []
  purchases: GroceryPurchase[] = []

  categoryMap: Record<number, GroceryCategory> = {}
  supermarketMap: Record<number, Supermarket> = {}
  itemMap: Record<number, GroceryItem> = {}

  // UI state
  showCategories = false
  showSupermarkets = false

  // Purchase modal
  showPurchaseModal = false
  purchaseItem: GroceryItem | null = null
  purchaseForm = { supermarketId: 0, price: 0, quantity: 0, purchasedAtDisplay: '', addToPantry: false, expiresAt: '' }

  // Item modal
  showItemModal = false
  itemForm: Partial<GroceryItem> = this.emptyItemForm()
  itemFormSupermarkets = new Set<number>()

  // Category modal
  showCategoryModal = false
  categoryForm: Partial<GroceryCategory> = { name: '', color: 'primary' }

  // Supermarket modal
  showSupermarketModal = false
  supermarketForm: Partial<Supermarket> = { name: '' }

  colorOptions = [
    { value: 'primary' }, { value: 'success' }, { value: 'danger' },
    { value: 'warning' }, { value: 'info' }, { value: 'secondary' },
  ]

  constructor(private svc: GroceryService, private pantrySvc: PantryService) {}

  ngOnInit() { this.loadAll() }

  loadAll() {
    forkJoin({
      categories: this.svc.getCategories(),
      supermarkets: this.svc.getSupermarkets(),
      allItems: this.svc.getItems(),
      purchases: this.svc.getAllPurchases(),
    }).subscribe(({ categories, supermarkets, allItems, purchases }) => {
      this.categories = categories
      this.supermarkets = supermarkets
      this.allItems = allItems
      this.purchases = purchases
      this.categoryMap = Object.fromEntries(categories.map(c => [c.id, c]))
      this.supermarketMap = Object.fromEntries(supermarkets.map(s => [s.id, s]))
      this.itemMap = Object.fromEntries(allItems.map(i => [i.id, i]))
      this.loadListItems()
    })
  }

  loadListItems() {
    const params: { onList: boolean; supermarketId?: number } = { onList: true }
    if (this.selectedSupermarketId !== null) params.supermarketId = this.selectedSupermarketId
    this.svc.getItems(params).subscribe(items => {
      this.listItems = items
    })
  }

  selectSupermarket(id: number | null) {
    this.selectedSupermarketId = id
    this.loadListItems()
  }

  get listGroups(): { label: string; color: string; items: GroceryItem[] }[] {
    const groups = new Map<string, { label: string; color: string; items: GroceryItem[] }>()
    for (const item of this.listItems) {
      const cat = item.groceryCategoryId ? this.categoryMap[item.groceryCategoryId] : null
      const key = cat ? cat.name : '—'
      if (!groups.has(key)) groups.set(key, { label: key, color: cat?.color ?? 'light', items: [] })
      groups.get(key)!.items.push(item)
    }
    return Array.from(groups.values()).sort((a, b) => a.label === '—' ? 1 : b.label === '—' ? -1 : a.label.localeCompare(b.label))
  }

  fmtPrice(n?: number | null): string { return n != null ? '$' + n.toFixed(2) : '' }

  formatDate(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' +
      d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  // ── Purchase flow ──

  openPurchaseModal(item: GroceryItem) {
    this.purchaseItem = item
    this.purchaseForm = {
      supermarketId: this.selectedSupermarketId ?? item.lastSupermarketId ?? (this.supermarkets[0]?.id ?? 0),
      price: item.lastPrice ?? 0,
      quantity: item.lastQuantity ?? 1,
      purchasedAtDisplay: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
      addToPantry: false,
      expiresAt: '',
    }
    this.showPurchaseModal = true
  }

  closePurchaseModal() { this.showPurchaseModal = false; this.purchaseItem = null }

  confirmPurchase() {
    if (!this.purchaseItem || !this.purchaseForm.supermarketId || this.purchaseForm.price < 0 || this.purchaseForm.quantity <= 0) return
    const item = this.purchaseItem
    this.svc.purchase(item.id, {
      supermarketId: this.purchaseForm.supermarketId,
      price: this.purchaseForm.price,
      quantity: this.purchaseForm.quantity,
    }).subscribe(() => {
      if (this.purchaseForm.addToPantry) {
        this.pantrySvc.createItem({
          groceryItemId: item.id,
          name: item.name,
          quantity: this.purchaseForm.quantity,
          unitType: item.unitType,
          purchasedAt: new Date().toISOString().slice(0, 10),
          expiresAt: this.purchaseForm.expiresAt || undefined,
        }).subscribe()
      }
      this.closePurchaseModal()
      this.loadAll()
    })
  }

  // ── Item CRUD ──

  emptyItemForm(): Partial<GroceryItem> {
    return { name: '', barcode: '', manufacturer: '', unitType: 'Units', isOnList: false, groceryCategoryId: undefined, supermarketIds: [] }
  }

  openItemForm(item?: GroceryItem) {
    this.itemForm = item ? { ...item } : this.emptyItemForm()
    this.itemFormSupermarkets = new Set(item?.supermarketIds ?? [])
    this.showItemModal = true
  }

  closeItemForm() { this.showItemModal = false }

  toggleItemSupermarket(id: number) {
    if (this.itemFormSupermarkets.has(id)) this.itemFormSupermarkets.delete(id)
    else this.itemFormSupermarkets.add(id)
  }

  saveItem() {
    const payload: Partial<GroceryItem> = { ...this.itemForm, supermarketIds: Array.from(this.itemFormSupermarkets) }
    if (!payload.barcode) payload.barcode = undefined
    if (!payload.manufacturer) payload.manufacturer = undefined
    if (payload.id) {
      this.svc.updateItem(payload as GroceryItem).subscribe(() => { this.closeItemForm(); this.loadAll() })
    } else {
      this.svc.createItem(payload).subscribe(() => { this.closeItemForm(); this.loadAll() })
    }
  }

  toggleList(item: GroceryItem) {
    this.svc.toggleList(item.id).subscribe(() => this.loadAll())
  }

  deleteItem(item: GroceryItem) {
    if (confirm(`Delete "${item.name}"?`)) {
      this.svc.deleteItem(item.id).subscribe(() => this.loadAll())
    }
  }

  // ── Category CRUD ──

  openCategoryForm(c?: GroceryCategory) {
    this.categoryForm = c ? { ...c } : { name: '', color: 'primary' }
    this.showCategoryModal = true
  }

  closeCategoryForm() { this.showCategoryModal = false }

  saveCategory() {
    if (!this.categoryForm.name?.trim()) return
    if (this.categoryForm.id) {
      this.svc.updateCategory(this.categoryForm as GroceryCategory).subscribe(() => { this.closeCategoryForm(); this.loadAll() })
    } else {
      this.svc.createCategory(this.categoryForm).subscribe(() => { this.closeCategoryForm(); this.loadAll() })
    }
  }

  deleteCategory(c: GroceryCategory) {
    if (confirm(`Delete category "${c.name}"? Items will become uncategorized.`)) {
      this.svc.deleteCategory(c.id).subscribe(() => this.loadAll())
    }
  }

  // ── Supermarket CRUD ──

  openSupermarketForm(s?: Supermarket) {
    this.supermarketForm = s ? { ...s } : { name: '' }
    this.showSupermarketModal = true
  }

  closeSupermarketForm() { this.showSupermarketModal = false }

  saveSupermarket() {
    if (!this.supermarketForm.name?.trim()) return
    if (this.supermarketForm.id) {
      this.svc.updateSupermarket(this.supermarketForm as Supermarket).subscribe(() => { this.closeSupermarketForm(); this.loadAll() })
    } else {
      this.svc.createSupermarket(this.supermarketForm).subscribe(() => { this.closeSupermarketForm(); this.loadAll() })
    }
  }

  deleteSupermarket(s: Supermarket) {
    if (confirm(`Delete "${s.name}"? This will fail if it has purchase history.`)) {
      this.svc.deleteSupermarket(s.id).subscribe({
        next: () => this.loadAll(),
        error: () => alert('Cannot delete a supermarket that has purchase history.'),
      })
    }
  }
}
