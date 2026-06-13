import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DecimalPipe, DatePipe } from '@angular/common'
import { CreditCardService, CreditCard, CreditCardStatement, CreditCardTransaction } from '../../core/services/api/credit-card.service'
import { CategoryService, Category } from '../../core/services/api/category.service'

@Component({
  selector: 'app-credit-cards',
  imports: [FormsModule, DecimalPipe, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">

      <!-- Page header -->
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Credit Cards</h4>
            <button class="btn btn-primary" (click)="openCardForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Card
            </button>
          </div>
        </div>
      </div>

      <!-- Cards grid -->
      <div class="row g-3 mb-4">
        @for (card of cards; track card.id) {
          <div class="col-md-6 col-xl-4">
            <div class="card h-100" style="border-top: 4px solid {{ card.color }}">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 class="card-title mb-0">{{ card.name }}</h5>
                    @if (card.lastFourDigits) {
                      <small class="text-muted">•••• {{ card.lastFourDigits }}</small>
                    }
                  </div>
                  <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-outline-secondary" (click)="openCardForm(card)">
                      <iconify-icon icon="tabler:edit" width="14"></iconify-icon> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="deleteCard(card.id)">
                      <iconify-icon icon="tabler:trash" width="14"></iconify-icon>
                    </button>
                  </div>
                </div>

                @if (card.notes) {
                  <p class="text-muted small mb-2">{{ card.notes }}</p>
                }

                <div class="d-flex gap-2 mt-3">
                  <button class="btn btn-sm btn-outline-primary flex-grow-1" (click)="selectCard(card)">
                    <iconify-icon icon="tabler:file-text" width="14"></iconify-icon> Statements
                  </button>
                  <button class="btn btn-sm btn-primary position-relative" (click)="triggerUpload(card.id)"
                    [disabled]="uploading[card.id]">
                    @if (uploading[card.id]) {
                      <span class="spinner-border spinner-border-sm me-1"></span>
                    } @else {
                      <iconify-icon icon="tabler:upload" width="14"></iconify-icon>
                    }
                    Upload PDF
                  </button>
                  <input type="file" accept=".pdf" style="display:none"
                    [id]="'upload-' + card.id"
                    (change)="onFileSelected(card.id, $event)">
                </div>
              </div>
            </div>
          </div>
        }

        @empty {
          <div class="col-12">
            <div class="card">
              <div class="card-body text-center text-muted py-5">
                <iconify-icon icon="tabler:credit-card" width="48" class="mb-2"></iconify-icon>
                <p>No credit cards yet. Add your first card to start uploading statements.</p>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Statements section -->
      @if (selectedCard) {
        <div class="row mb-4">
          <div class="col-12">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <iconify-icon icon="tabler:file-text" width="18" class="me-1"></iconify-icon>
                  Statements — {{ selectedCard.name }}
                </h5>
                <button class="btn btn-sm btn-outline-secondary" (click)="selectedCard = null; selectedStatement = null">
                  <iconify-icon icon="tabler:x" width="14"></iconify-icon>
                </button>
              </div>
              <div class="card-body p-0">
                @if (statements.length === 0) {
                  <p class="text-muted text-center py-4 mb-0">No statements uploaded yet.</p>
                } @else {
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <thead class="table-light">
                        <tr>
                          <th>File</th>
                          <th>Period</th>
                          <th>Uploaded</th>
                          <th>Total</th>
                          <th>Transactions</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (stmt of statements; track stmt.id) {
                          <tr>
                            <td class="small">{{ stmt.fileName }}</td>
                            <td class="small">
                              @if (stmt.statementMonth && stmt.statementYear) {
                                {{ monthName(stmt.statementMonth) }} {{ stmt.statementYear }}
                              } @else { — }
                            </td>
                            <td class="small">{{ stmt.uploadedAt | date:'MM/dd/yy' }}</td>
                            <td class="small">
                              @if (stmt.totalAmount != null) {
                                \${{ stmt.totalAmount | number:'1.2-2' }}
                              } @else { — }
                            </td>
                            <td class="small text-center">{{ stmt.transactionCount }}</td>
                            <td>
                              <span class="badge"
                                [class.bg-warning]="stmt.status === 'Pending'"
                                [class.text-dark]="stmt.status === 'Pending'"
                                [class.bg-info]="stmt.status === 'Processing'"
                                [class.bg-success]="stmt.status === 'Processed'"
                                [class.bg-danger]="stmt.status === 'Failed'">
                                @if (stmt.status === 'Pending' || stmt.status === 'Processing') {
                                  <span class="spinner-border spinner-border-sm me-1" style="width:10px;height:10px"></span>
                                }
                                {{ stmt.status }}
                              </span>
                              @if (stmt.status === 'Failed' && stmt.errorMessage) {
                                <div class="small text-danger mt-1">{{ stmt.errorMessage }}</div>
                              }
                            </td>
                            <td>
                              <div class="d-flex gap-1 justify-content-end">
                                @if (stmt.status === 'Processed' && stmt.transactionCount > 0) {
                                  <button class="btn btn-sm btn-outline-primary" (click)="selectStatement(stmt)">
                                    View
                                  </button>
                                }
                                <button class="btn btn-sm btn-outline-danger" (click)="deleteStatement(stmt.id)">
                                  <iconify-icon icon="tabler:trash" width="14"></iconify-icon>
                                </button>
                              </div>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Transactions section -->
      @if (selectedStatement) {
        <div class="row mb-4">
          <div class="col-12">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 class="mb-0">
                  <iconify-icon icon="tabler:list" width="18" class="me-1"></iconify-icon>
                  {{ selectedStatement.fileName }}
                  @if (selectedStatement.statementMonth && selectedStatement.statementYear) {
                    <small class="text-muted ms-1">({{ monthName(selectedStatement.statementMonth) }} {{ selectedStatement.statementYear }})</small>
                  }
                </h5>
                <button class="btn btn-sm btn-outline-secondary" (click)="selectedStatement = null">
                  <iconify-icon icon="tabler:x" width="14"></iconify-icon>
                </button>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th class="text-end">Amount</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (tx of transactions; track tx.id) {
                        <tr>
                          <td class="small text-nowrap">{{ tx.date | date:'MM/dd/yy' }}</td>
                          <td class="small">{{ tx.description }}</td>
                          <td class="text-end small fw-semibold"
                            [class.text-danger]="tx.type === 'Expense'"
                            [class.text-success]="tx.type === 'Credit'">
                            \${{ tx.amount | number:'1.2-2' }}
                          </td>
                          <td>
                            <span class="badge" [class.bg-danger]="tx.type === 'Expense'" [class.bg-success]="tx.type === 'Credit'">
                              {{ tx.type }}
                            </span>
                          </td>
                          <td>
                            @if (tx.category) {
                              <span class="badge" [style.background-color]="tx.category.color || '#6c757d'">
                                {{ tx.category.name }}
                              </span>
                            } @else {
                              <span class="text-muted small">Unclassified</span>
                            }
                          </td>
                          <td>
                            @if (tx.isAiClassified) {
                              <span class="badge bg-info text-white" title="Classified by AI">AI</span>
                            }
                          </td>
                          <td>
                            <button class="btn btn-sm btn-outline-secondary" (click)="openTxEdit(tx)">
                              Edit
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                    <tfoot class="table-light fw-semibold">
                      <tr>
                        <td colspan="2">Totals</td>
                        <td class="text-end text-danger">\${{ totalCharges | number:'1.2-2' }}</td>
                        <td colspan="4">
                          <span class="text-success me-3">Credits: \${{ totalCredits | number:'1.2-2' }}</span>
                          <span>Net: \${{ (totalCharges - totalCredits) | number:'1.2-2' }}</span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Add/Edit Card Modal -->
      @if (showCardModal) {
        <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ cardForm.id ? 'Edit' : 'Add' }} Card</h5>
                <button class="btn-close" (click)="closeCardForm()"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Name</label>
                  <input class="form-control" [(ngModel)]="cardForm.name" placeholder="e.g. Visa Signature" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Last 4 Digits</label>
                  <input class="form-control" [(ngModel)]="cardForm.lastFourDigits" maxlength="4" placeholder="4242" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Card Color</label>
                  <input type="color" class="form-control form-control-color" [(ngModel)]="cardForm.color" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Notes</label>
                  <textarea class="form-control" [(ngModel)]="cardForm.notes" rows="2"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" (click)="closeCardForm()">Cancel</button>
                <button class="btn btn-primary" (click)="saveCard()">Save</button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Edit Transaction Modal -->
      @if (showTxModal && txForm) {
        <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Edit Transaction</h5>
                <button class="btn-close" (click)="closeTxEdit()"></button>
              </div>
              <div class="modal-body">
                <p class="text-muted small mb-3">{{ txForm.description }}</p>
                <div class="mb-3">
                  <label class="form-label">Type</label>
                  <select class="form-select" [(ngModel)]="txForm.type">
                    <option value="Expense">Expense</option>
                    <option value="Credit">Credit</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Category</label>
                  <select class="form-select" [(ngModel)]="txForm.categoryId">
                    <option [ngValue]="null">-- Unclassified --</option>
                    @for (cat of categories; track cat.id) {
                      <option [ngValue]="cat.id">{{ cat.name }}</option>
                    }
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Notes</label>
                  <textarea class="form-control" [(ngModel)]="txForm.notes" rows="2"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" (click)="closeTxEdit()">Cancel</button>
                <button class="btn btn-primary" (click)="saveTxEdit()">Save</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class CreditCards implements OnInit, OnDestroy {
  cards: CreditCard[] = []
  selectedCard: CreditCard | null = null
  statements: CreditCardStatement[] = []
  selectedStatement: CreditCardStatement | null = null
  transactions: CreditCardTransaction[] = []
  categories: Category[] = []

  showCardModal = false
  showTxModal = false
  cardForm: Partial<CreditCard> = {}
  txForm: (Partial<CreditCardTransaction> & { id: number }) | null = null

  uploading: Record<number, boolean> = {}
  private pollIntervalId: ReturnType<typeof setInterval> | null = null

  constructor(
    private svc: CreditCardService,
    private catSvc: CategoryService
  ) {}

  ngOnInit() {
    this.loadCards()
    this.catSvc.getAll().subscribe(c => this.categories = c)
  }

  ngOnDestroy() {
    this.stopPolling()
  }

  loadCards() {
    this.svc.getCards().subscribe(cards => this.cards = cards)
  }

  selectCard(card: CreditCard) {
    this.selectedCard = card
    this.selectedStatement = null
    this.transactions = []
    this.loadStatements(card.id)
  }

  loadStatements(cardId: number) {
    this.svc.getStatements(cardId).subscribe(stmts => {
      this.statements = stmts
      this.startPollingIfNeeded()
    })
  }

  selectStatement(stmt: CreditCardStatement) {
    this.selectedStatement = stmt
    this.svc.getTransactions(stmt.id).subscribe(txs => this.transactions = txs)
  }

  // ── Card CRUD ──────────────────────────────────────────────────────────

  openCardForm(card?: CreditCard) {
    this.cardForm = card ? { ...card } : { name: '', lastFourDigits: '', color: '#343a40', notes: '' }
    this.showCardModal = true
  }

  closeCardForm() { this.showCardModal = false }

  saveCard() {
    if (this.cardForm.id) {
      this.svc.updateCard(this.cardForm as CreditCard).subscribe(() => {
        this.loadCards()
        this.closeCardForm()
      })
    } else {
      this.svc.createCard(this.cardForm as Omit<CreditCard, 'id' | 'createdAt'>).subscribe(() => {
        this.loadCards()
        this.closeCardForm()
      })
    }
  }

  deleteCard(id: number) {
    if (!confirm('Delete this card and all its statements?')) return
    this.svc.deleteCard(id).subscribe(() => {
      if (this.selectedCard?.id === id) {
        this.selectedCard = null
        this.selectedStatement = null
      }
      this.loadCards()
    })
  }

  // ── Statement upload & management ─────────────────────────────────────

  triggerUpload(cardId: number) {
    const el = document.getElementById('upload-' + cardId) as HTMLInputElement
    el?.click()
  }

  onFileSelected(cardId: number, event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    this.uploading[cardId] = true
    this.svc.uploadStatement(cardId, file).subscribe({
      next: () => {
        this.uploading[cardId] = false
        input.value = ''
        if (this.selectedCard?.id === cardId) {
          this.loadStatements(cardId)
        } else {
          this.selectCard(this.cards.find(c => c.id === cardId)!)
        }
      },
      error: () => {
        this.uploading[cardId] = false
        input.value = ''
        alert('Upload failed. Please try again.')
      }
    })
  }

  deleteStatement(id: number) {
    if (!confirm('Delete this statement and all its transactions?')) return
    this.svc.deleteStatement(id).subscribe(() => {
      if (this.selectedStatement?.id === id) this.selectedStatement = null
      if (this.selectedCard) this.loadStatements(this.selectedCard.id)
    })
  }

  // ── Transaction editing ────────────────────────────────────────────────

  openTxEdit(tx: CreditCardTransaction) {
    this.txForm = { ...tx, categoryId: tx.categoryId ?? undefined }
    this.showTxModal = true
  }

  closeTxEdit() {
    this.showTxModal = false
    this.txForm = null
  }

  saveTxEdit() {
    if (!this.txForm) return
    this.svc.updateTransaction(this.txForm.id, {
      categoryId: this.txForm.categoryId ?? null,
      notes: this.txForm.notes ?? '',
      type: this.txForm.type ?? 'Expense'
    }).subscribe(() => {
      if (this.selectedStatement) this.svc.getTransactions(this.selectedStatement.id).subscribe(txs => this.transactions = txs)
      this.closeTxEdit()
    })
  }

  // ── Polling ────────────────────────────────────────────────────────────

  private startPollingIfNeeded() {
    const hasPending = this.statements.some(s => s.status === 'Pending' || s.status === 'Processing')
    if (hasPending && !this.pollIntervalId) {
      this.pollIntervalId = setInterval(() => this.refreshPendingStatements(), 5000)
    } else if (!hasPending) {
      this.stopPolling()
    }
  }

  private refreshPendingStatements() {
    const pending = this.statements.filter(s => s.status === 'Pending' || s.status === 'Processing')
    if (pending.length === 0) { this.stopPolling(); return }

    pending.forEach(stmt => {
      this.svc.getStatement(stmt.id).subscribe(updated => {
        const idx = this.statements.findIndex(s => s.id === updated.id)
        if (idx >= 0) this.statements[idx] = updated
        if (updated.status !== 'Pending' && updated.status !== 'Processing') {
          const stillPending = this.statements.some(s => s.status === 'Pending' || s.status === 'Processing')
          if (!stillPending) this.stopPolling()
        }
      })
    })
  }

  private stopPolling() {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId)
      this.pollIntervalId = null
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  get totalCharges(): number {
    return this.transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0)
  }

  get totalCredits(): number {
    return this.transactions.filter(t => t.type === 'Credit').reduce((s, t) => s + t.amount, 0)
  }

  monthName(m: number): string {
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1] ?? ''
  }
}
