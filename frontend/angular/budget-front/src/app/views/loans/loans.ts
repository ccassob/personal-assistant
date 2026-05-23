import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DecimalPipe } from '@angular/common'
import { Loan, LoanService } from '../../core/services/api/loan.service'

@Component({
  selector: 'app-loans',
  imports: [FormsModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Loans</h4>
            <button class="btn btn-primary" (click)="openForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Loan
            </button>
          </div>
        </div>
      </div>

      <div class="row g-3">
        @for (l of loans; track l.id) {
          <div class="col-md-6 col-xl-4">
            <div class="card h-100">
              <div class="card-body">

                <!-- Header -->
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <h5 class="card-title mb-0">{{ l.name }}</h5>
                  <span class="badge" [class.bg-success]="isPaidOff(l)" [class.bg-primary]="!isPaidOff(l)">
                    {{ isPaidOff(l) ? 'Paid Off' : 'Active' }}
                  </span>
                </div>

                <!-- Loan basics -->
                <div class="row g-2 mb-3">
                  <div class="col-6">
                    <div class="text-muted small">Original Amount</div>
                    <div class="fw-semibold">{{ l.loanAmount | number:'1.2-2' }}</div>
                  </div>
                  <div class="col-6">
                    <div class="text-muted small">Current Balance</div>
                    <div class="fw-semibold text-danger">{{ l.currentBalance | number:'1.2-2' }}</div>
                  </div>
                  <div class="col-6">
                    <div class="text-muted small">Interest Rate</div>
                    <div class="fw-semibold">{{ l.interestRate | number:'1.2-4' }}%</div>
                  </div>
                  <div class="col-6">
                    <div class="text-muted small">Term</div>
                    <div class="fw-semibold">{{ l.termMonths }} months</div>
                  </div>
                </div>

                <!-- Monthly payment breakdown -->
                <div class="border rounded p-2 mb-3 bg-light">
                  <div class="text-muted small fw-semibold mb-1">Monthly Payment Breakdown</div>
                  <div class="d-flex justify-content-between">
                    <span class="small">Principal</span>
                    <span class="small fw-semibold text-success">{{ currentPrincipalPortion(l) | number:'1.2-2' }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span class="small">Interest</span>
                    <span class="small fw-semibold text-warning">{{ currentInterestPortion(l) | number:'1.2-2' }}</span>
                  </div>
                  @if (l.insuranceAmount > 0) {
                    <div class="d-flex justify-content-between">
                      <span class="small">Insurance</span>
                      <span class="small fw-semibold text-info">{{ l.insuranceAmount | number:'1.2-2' }}</span>
                    </div>
                  }
                  <hr class="my-1">
                  <div class="d-flex justify-content-between">
                    <span class="small fw-semibold">Total Monthly</span>
                    <span class="small fw-bold">{{ totalMonthlyPayment(l) | number:'1.2-2' }}</span>
                  </div>
                </div>

                <!-- Totals -->
                <div class="row g-2 mb-3">
                  <div class="col-6">
                    <div class="text-muted small">Total Cost</div>
                    <div class="fw-semibold">{{ totalCost(l) | number:'1.2-2' }}</div>
                  </div>
                  <div class="col-6">
                    <div class="text-muted small">Total Interest</div>
                    <div class="fw-semibold text-warning">{{ totalInterest(l) | number:'1.2-2' }}</div>
                  </div>
                </div>

                <!-- Progress -->
                <div class="mb-1 d-flex justify-content-between">
                  <small class="text-muted">{{ elapsedMonths(l) }} of {{ l.termMonths }} months</small>
                  <small class="text-muted">End: {{ endDate(l) }}</small>
                </div>
                <div class="progress" style="height:8px">
                  <div
                    class="progress-bar"
                    [class.bg-success]="isPaidOff(l)"
                    [class.bg-primary]="!isPaidOff(l)"
                    [style.width.%]="progress(l) > 100 ? 100 : progress(l)"
                  ></div>
                </div>
                <small class="text-muted">Started: {{ l.startDate }}</small>

              </div>

              @if (l.goalAmount && l.goalDate) {
                <div class="px-3 pb-2">
                  <button class="btn btn-sm btn-outline-secondary w-100 d-flex justify-content-between align-items-center" (click)="toggleGoal(l.id)">
                    <span><iconify-icon icon="tabler:target" width="14" class="me-1"></iconify-icon> Goal</span>
                    <iconify-icon [attr.icon]="expandedGoals.has(l.id) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                  </button>
                  @if (expandedGoals.has(l.id)) {
                    <div class="border rounded p-2 mt-2 bg-light">
                      @if (goalMonthsRemaining(l) <= 0) {
                        <div class="text-danger small">Goal date is in the past.</div>
                      } @else if ((l.goalAmount ?? 0) >= l.currentBalance) {
                        <div class="text-success small">Goal already reached!</div>
                      } @else {
                        <div class="d-flex justify-content-between mb-1">
                          <span class="small text-muted">Target balance</span>
                          <span class="small fw-semibold">{{ l.goalAmount | number:'1.2-2' }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                          <span class="small text-muted">Goal date</span>
                          <span class="small fw-semibold">{{ l.goalDate }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                          <span class="small text-muted">Months remaining</span>
                          <span class="small fw-semibold">{{ goalMonthsRemaining(l) }}</span>
                        </div>
                        <hr class="my-1">
                        @if (goalMonthlyPaymentExtra(l) <= 0) {
                          <div class="text-success small">Your current payment is enough to reach the goal.</div>
                        } @else {
                          <div class="d-flex justify-content-between mb-1">
                            <span class="small text-muted">Extra payment / month</span>
                            <span class="small fw-bold text-primary">{{ goalMonthlyPaymentExtra(l) | number:'1.2-2' }}</span>
                          </div>
                          <div class="d-flex justify-content-between">
                            <span class="small text-muted">Total payment / month</span>
                            <span class="small fw-semibold">{{ goalMonthlyPaymentTotal(l) | number:'1.2-2' }}</span>
                          </div>
                        }
                      }
                    </div>
                  }
                </div>
              }

              <div class="card-footer d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary flex-fill" (click)="openForm(l)">Edit</button>
                <button class="btn btn-sm btn-outline-danger flex-fill" (click)="delete(l.id)">Delete</button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12 text-center text-muted py-5">No loans yet. Add one to start tracking.</div>
        }
      </div>
    </div>

    @if (showModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ form.id ? 'Edit' : 'Add' }} Loan</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Loan Name</label>
                <input class="form-control" [(ngModel)]="form.name" placeholder="e.g. Car Loan, Mortgage">
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Loan Amount</label>
                  <input type="number" class="form-control" [(ngModel)]="form.loanAmount" min="0" step="0.01">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Current Balance</label>
                  <input type="number" class="form-control" [(ngModel)]="form.currentBalance" min="0" step="0.01">
                </div>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Start Date</label>
                  <input type="date" class="form-control" [(ngModel)]="form.startDate">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Loan Term (months)</label>
                  <input type="number" class="form-control" [(ngModel)]="form.termMonths" min="1" step="1">
                </div>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Annual Interest Rate (%)</label>
                  <input type="number" class="form-control" [(ngModel)]="form.interestRate" min="0" step="0.01">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Monthly Payment (P+I)</label>
                  <input type="number" class="form-control" [(ngModel)]="form.monthlyPayment" min="0" step="0.01">
                </div>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Insurance Amount</label>
                  <input type="number" class="form-control" [(ngModel)]="form.insuranceAmount" min="0" step="0.01">
                </div>
              </div>
              <hr>
              <div class="text-muted small fw-semibold mb-2">Repayment Goal (optional)</div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Goal Balance</label>
                  <input type="number" class="form-control" [(ngModel)]="form.goalAmount" min="0" step="0.01" placeholder="e.g. 5000">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Goal Date</label>
                  <input type="date" class="form-control" [(ngModel)]="form.goalDate">
                </div>
              </div>
              @if (form.monthlyPayment! > 0 || form.insuranceAmount! > 0) {
                <div class="alert alert-info py-2 small mb-0">
                  Total monthly: <strong>{{ (form.monthlyPayment! + form.insuranceAmount!) | number:'1.2-2' }}</strong>
                </div>
              }
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
export class Loans implements OnInit {
  loans: Loan[] = []
  showModal = false
  form: Partial<Loan> = this.emptyForm()
  expandedGoals = new Set<number>()

  constructor(private svc: LoanService) {}

  ngOnInit() { this.load() }

  load() { this.svc.getAll().subscribe(data => this.loans = data) }

  emptyForm(): Partial<Loan> {
    return {
      name: '',
      loanAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      interestRate: 0,
      monthlyPayment: 0,
      termMonths: 12,
      insuranceAmount: 0,
      currentBalance: 0,
      goalAmount: undefined,
      goalDate: undefined,
    }
  }

  elapsedMonths(l: Loan): number {
    const start = new Date(l.startDate)
    const now = new Date()
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
    return Math.min(Math.max(months, 0), l.termMonths)
  }

  /** Remaining balance using standard amortization formula */
  currentBalance(l: Loan): number {
    const r = l.interestRate / 12 / 100
    const n = this.elapsedMonths(l)
    if (r === 0) return Math.max(l.loanAmount - l.monthlyPayment * n, 0)
    const balance = l.loanAmount * Math.pow(1 + r, n)
      - l.monthlyPayment * (Math.pow(1 + r, n) - 1) / r
    return Math.max(balance, 0)
  }

  /** Interest portion of the next payment */
  currentInterestPortion(l: Loan): number {
    const r = l.interestRate / 12 / 100
    return this.currentBalance(l) * r
  }

  /** Principal portion of the next payment */
  currentPrincipalPortion(l: Loan): number {
    return Math.max(l.monthlyPayment - this.currentInterestPortion(l), 0)
  }

  totalMonthlyPayment(l: Loan): number {
    return l.monthlyPayment + l.insuranceAmount
  }

  progress(l: Loan): number {
    return l.termMonths > 0 ? (this.elapsedMonths(l) / l.termMonths) * 100 : 0
  }

  /** Total out-of-pocket cost over the loan term (P+I payments + insurance) */
  totalCost(l: Loan): number {
    return this.totalMonthlyPayment(l) * l.termMonths
  }

  /** Total interest paid over the life of the loan (excludes insurance) */
  totalInterest(l: Loan): number {
    return l.monthlyPayment * l.termMonths - l.loanAmount
  }

  endDate(l: Loan): string {
    const d = new Date(l.startDate)
    d.setMonth(d.getMonth() + l.termMonths)
    return d.toISOString().split('T')[0]
  }

  isPaidOff(l: Loan): boolean {
    return this.elapsedMonths(l) >= l.termMonths
  }

  toggleGoal(id: number) {
    if (this.expandedGoals.has(id)) this.expandedGoals.delete(id)
    else this.expandedGoals.add(id)
  }

  goalMonthsRemaining(l: Loan): number {
    if (!l.goalDate) return 0
    const goal = new Date(l.goalDate)
    const now = new Date()
    return (goal.getFullYear() - now.getFullYear()) * 12 + (goal.getMonth() - now.getMonth())
  }

  goalMonthlyPaymentTotal(l: Loan): number {
    const N = this.goalMonthsRemaining(l)
    const B = l.currentBalance
    const T = l.goalAmount ?? 0
    const r = l.interestRate / 12 / 100
    if (N <= 0) return 0
    if (r === 0) return (B - T) / N
    const factor = Math.pow(1 + r, N)
    return (B * factor - T) * r / (factor - 1)
  }

  goalMonthlyPaymentExtra(l: Loan): number {
    return Math.max(this.goalMonthlyPaymentTotal(l) - l.monthlyPayment, 0)
  }

  openForm(l?: Loan) {
    this.form = l ? { ...l } : this.emptyForm()
    this.showModal = true
  }

  closeForm() { this.showModal = false }

  save() {
    if (this.form.id) {
      this.svc.update(this.form as Loan).subscribe(() => { this.load(); this.closeForm() })
    } else {
      this.svc.create(this.form as Omit<Loan, 'id'>).subscribe(() => { this.load(); this.closeForm() })
    }
  }

  delete(id: number) {
    if (confirm('Delete this loan?')) {
      this.svc.delete(id).subscribe(() => this.load())
    }
  }
}
