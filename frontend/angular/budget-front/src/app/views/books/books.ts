import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DecimalPipe } from '@angular/common'
import { NgApexchartsModule } from 'ng-apexcharts'
import { forkJoin } from 'rxjs'
import { Book, BookProgress, BookTask, BookService } from '../../core/services/api/book.service'

@Component({
  selector: 'app-books',
  imports: [FormsModule, DecimalPipe, NgApexchartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Books</h4>
            <button class="btn btn-primary" (click)="openForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Book
            </button>
          </div>
        </div>
      </div>

      @if (books.length > 0) {
        <div class="row mb-3">
          <div class="col-12">
            <div class="card">
              <div class="card-body pb-0">
                <h6 class="text-muted mb-0">Pages Read Per Day</h6>
                <apx-chart
                  [series]="histSeries"
                  [chart]="histOpts.chart"
                  [stroke]="histOpts.stroke"
                  [fill]="histOpts.fill"
                  [dataLabels]="histOpts.dataLabels"
                  [xaxis]="histOpts.xaxis"
                  [yaxis]="histOpts.yaxis"
                  [colors]="histOpts.colors"
                  [grid]="histOpts.grid"
                  [tooltip]="histOpts.tooltip"
                ></apx-chart>
              </div>
            </div>
          </div>
        </div>
      }

      <div class="row g-3">
        @for (b of books; track b.id) {
          <div class="col-md-6 col-xl-4">
            <div class="card h-100">
              <div class="card-body">

                <!-- Header -->
                <div class="d-flex justify-content-between align-items-start mb-1">
                  <h5 class="card-title mb-0">{{ b.title }}</h5>
                  <div class="d-flex gap-1 flex-shrink-0 ms-2">
                    @if (b.bookType === 'Technology') {
                      <span class="badge bg-info text-dark">
                        <iconify-icon icon="tabler:cpu" width="11"></iconify-icon> Tech
                      </span>
                    }
                    <span class="badge"
                      [class.bg-primary]="b.status === 'Reading'"
                      [class.bg-success]="b.status === 'Completed'"
                      [class.bg-warning]="b.status === 'Paused'"
                      [class.text-dark]="b.status === 'Paused'"
                      [class.bg-secondary]="b.status === 'Wishlist'">{{ b.status }}</span>
                  </div>
                </div>
                <div class="text-muted small mb-3">{{ b.author }}</div>

                <!-- Progress bar -->
                <div class="mb-1 d-flex justify-content-between">
                  <small class="text-muted">Page {{ b.currentPage }} of {{ b.totalPages }}</small>
                  <small class="text-muted">{{ progressPct(b) | number:'1.0-0' }}%</small>
                </div>
                <div class="progress mb-3" style="height: 8px">
                  <div
                    class="progress-bar"
                    [class.bg-success]="b.status === 'Completed'"
                    [class.bg-primary]="b.status !== 'Completed'"
                    [style.width.%]="progressPct(b) > 100 ? 100 : progressPct(b)"
                  ></div>
                </div>

                <!-- Core stats -->
                <div class="row g-2 mb-3">
                  <div class="col-6">
                    <div class="text-muted small">Pages Remaining</div>
                    <div class="fw-semibold">{{ pagesRemaining(b) }}</div>
                  </div>
                  @if (b.status !== 'Wishlist') {
                    <div class="col-6">
                      <div class="text-muted small">Days Reading</div>
                      <div class="fw-semibold">{{ daysReading(b) }}</div>
                    </div>
                  }
                </div>

                <!-- Pace & estimate -->
                @if (b.status !== 'Wishlist' && b.status !== 'Completed' && b.currentPage > 0) {
                  <div class="border rounded p-2 mb-3 bg-light">
                    <div class="text-muted small fw-semibold mb-1">
                      Reading Pace
                      @if (hasHistory(b.id)) {
                        <span class="badge bg-info text-dark ms-1" style="font-size:.65rem">based on history</span>
                      }
                    </div>
                    <div class="d-flex justify-content-between mb-1">
                      <span class="small">Daily pace</span>
                      <span class="small fw-semibold text-primary">{{ recentPace(b) | number:'1.1-1' }} pages/day</span>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span class="small">Est. finish at this pace</span>
                      <span class="small fw-semibold">{{ estimatedFinish(b) }}</span>
                    </div>
                  </div>

                  @if (b.targetDate) {
                    <div class="border rounded p-2 mb-3 bg-light">
                      <div class="text-muted small fw-semibold mb-1">Target Date Analysis</div>
                      <div class="d-flex justify-content-between mb-1">
                        <span class="small">Target date</span>
                        <span class="small fw-semibold">{{ b.targetDate }}</span>
                      </div>
                      <div class="d-flex justify-content-between mb-1">
                        <span class="small">Days to target</span>
                        <span class="small fw-semibold" [class.text-danger]="daysToTarget(b) < 0">
                          {{ daysToTarget(b) < 0 ? 'Overdue by ' + (-daysToTarget(b)) + 'd' : daysToTarget(b) + ' days' }}
                        </span>
                      </div>
                      <hr class="my-1">
                      <div class="d-flex justify-content-between">
                        <span class="small text-muted">Required pace</span>
                        <span class="small fw-bold"
                          [class.text-danger]="daysToTarget(b) > 0 && requiredPace(b) > recentPace(b)"
                          [class.text-success]="daysToTarget(b) > 0 && requiredPace(b) <= recentPace(b)">
                          {{ daysToTarget(b) > 0 ? (requiredPace(b) | number:'1.1-1') + ' pages/day' : '—' }}
                        </span>
                      </div>
                    </div>
                  }
                }

                @if (b.notes) {
                  <p class="text-muted small fst-italic mb-2">{{ b.notes }}</p>
                }

                <!-- Quick Update Pages (only for active books) -->
                @if (b.status === 'Reading' || b.status === 'Paused') {
                  <button class="btn btn-sm btn-outline-primary w-100 d-flex justify-content-between align-items-center mb-2"
                    (click)="toggleUpdate(b)">
                    <span><iconify-icon icon="tabler:pencil" width="14" class="me-1"></iconify-icon> Update Pages</span>
                    <iconify-icon [attr.icon]="expandedUpdate.has(b.id) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                  </button>
                  @if (expandedUpdate.has(b.id)) {
                    <div class="border rounded p-2 mb-2">
                      <div class="d-flex gap-2 align-items-center mb-1">
                        <input type="number" class="form-control form-control-sm"
                          [(ngModel)]="updateForms[b.id]"
                          min="0" [max]="b.totalPages"
                          placeholder="Current page">
                        <button class="btn btn-sm btn-primary text-nowrap" (click)="saveProgress(b)">Save</button>
                      </div>
                      <small class="text-muted">Currently on page {{ b.currentPage }} of {{ b.totalPages }}</small>
                    </div>
                  }
                }

                <!-- Lab Tasks (only for Technology books) -->
                @if (b.bookType === 'Technology') {
                  <button class="btn btn-sm btn-outline-info w-100 d-flex justify-content-between align-items-center mb-2"
                    (click)="toggleLabs(b)">
                    <span>
                      <iconify-icon icon="tabler:flask" width="14" class="me-1"></iconify-icon>
                      Labs
                      <span class="ms-1 badge bg-info text-dark" style="font-size:.7rem">
                        {{ doneCount(b.id) }}/{{ totalCount(b.id) }}
                      </span>
                    </span>
                    <iconify-icon [attr.icon]="expandedLabs.has(b.id) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                  </button>
                  @if (expandedLabs.has(b.id)) {
                    <div class="border rounded p-2 mb-2">
                      @if (!tasks.has(b.id)) {
                        <div class="text-muted small text-center py-1">Loading...</div>
                      } @else {
                        <!-- Task list -->
                        @if ((tasks.get(b.id) ?? []).length === 0) {
                          <div class="text-muted small text-center py-1">No labs yet. Add one below.</div>
                        } @else {
                          <ul class="list-unstyled mb-2">
                            @for (t of tasks.get(b.id) ?? []; track t.id) {
                              <li class="d-flex align-items-center gap-2 py-1 border-bottom">
                                <input type="checkbox" class="form-check-input mt-0 flex-shrink-0"
                                  [checked]="t.isDone"
                                  (change)="toggleTask(b, t)">
                                <span class="small flex-grow-1"
                                  [class.text-decoration-line-through]="t.isDone"
                                  [class.text-muted]="t.isDone">{{ t.title }}</span>
                                <button class="btn btn-link btn-sm p-0 text-danger" (click)="deleteTask(b, t)">
                                  <iconify-icon icon="tabler:trash" width="14"></iconify-icon>
                                </button>
                              </li>
                            }
                          </ul>
                        }
                        <!-- Add task form -->
                        <div class="d-flex gap-2 mt-1">
                          <input type="text" class="form-control form-control-sm"
                            [(ngModel)]="newTaskTitle[b.id]"
                            placeholder="New lab title..."
                            (keyup.enter)="addTask(b)">
                          <button class="btn btn-sm btn-info text-nowrap" (click)="addTask(b)">Add</button>
                        </div>
                      }
                    </div>
                  }
                }

                <!-- Reading History -->
                <button class="btn btn-sm btn-outline-secondary w-100 d-flex justify-content-between align-items-center"
                  (click)="toggleHistory(b.id)">
                  <span><iconify-icon icon="tabler:history" width="14" class="me-1"></iconify-icon> Reading History</span>
                  <iconify-icon [attr.icon]="expandedHistory.has(b.id) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                </button>
                @if (expandedHistory.has(b.id)) {
                  <div class="border rounded p-2 mt-2">
                    @if (!histories.has(b.id)) {
                      <div class="text-muted small text-center py-1">Loading...</div>
                    } @else if ((histories.get(b.id) ?? []).length === 0) {
                      <div class="text-muted small text-center py-1">No history yet. Use "Update Pages" to start tracking.</div>
                    } @else {
                      <table class="table table-sm table-borderless mb-0">
                        <thead>
                          <tr>
                            <th class="text-muted small ps-0">Date</th>
                            <th class="text-muted small text-end">Page</th>
                            <th class="text-muted small text-end pe-0">Read</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (h of historyDisplay(b.id); track h.date) {
                            <tr>
                              <td class="small ps-0">{{ h.date }}</td>
                              <td class="small text-end">{{ h.currentPage }}</td>
                              <td class="small text-end pe-0 text-success fw-semibold">+{{ h.pagesRead }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    }
                  </div>
                }

              </div>

              <div class="card-footer d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary flex-fill" (click)="openForm(b)">Edit</button>
                <button class="btn btn-sm btn-outline-danger flex-fill" (click)="delete(b.id)">Delete</button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12 text-center text-muted py-5">No books yet. Add one to start tracking your reading!</div>
        }
      </div>
    </div>

    @if (showModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ form.id ? 'Edit' : 'Add' }} Book</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input class="form-control" [(ngModel)]="form.title" placeholder="e.g. The Pragmatic Programmer">
              </div>
              <div class="mb-3">
                <label class="form-label">Author</label>
                <input class="form-control" [(ngModel)]="form.author" placeholder="e.g. Andrew Hunt">
              </div>
              <div class="mb-3">
                <label class="form-label">Book Type</label>
                <select class="form-select" [(ngModel)]="form.bookType">
                  <option value="Literature">Literature</option>
                  <option value="Technology">Technology</option>
                </select>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Total Pages</label>
                  <input type="number" class="form-control" [(ngModel)]="form.totalPages" min="1" step="1">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Current Page</label>
                  <input type="number" class="form-control" [(ngModel)]="form.currentPage" min="0" step="1" [max]="form.totalPages ?? null">
                </div>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Start Date</label>
                  <input type="date" class="form-control" [(ngModel)]="form.startDate">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Target Finish Date</label>
                  <input type="date" class="form-control" [(ngModel)]="form.targetDate">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" [(ngModel)]="form.status" (ngModelChange)="onStatusChange()">
                  <option value="Reading">Reading</option>
                  <option value="Paused">Paused</option>
                  <option value="Wishlist">Wishlist</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              @if (form.status === 'Completed') {
                <div class="alert alert-success py-2 small mb-3">
                  <iconify-icon icon="tabler:check" width="14" class="me-1"></iconify-icon>
                  Current page set to total pages ({{ form.totalPages }}).
                </div>
              }
              <div class="mb-3">
                <label class="form-label">Notes <span class="text-muted">(optional)</span></label>
                <textarea class="form-control" [(ngModel)]="form.notes" rows="2" placeholder="Thoughts, quotes, reminders..."></textarea>
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
export class Books implements OnInit {
  books: Book[] = []
  showModal = false
  form: Partial<Book> = this.emptyForm()

  histSeries: any[] = []
  histOpts: any = {}

  expandedUpdate = new Set<number>()
  expandedHistory = new Set<number>()
  expandedLabs = new Set<number>()
  updateForms: Record<number, number> = {}
  histories = new Map<number, BookProgress[]>()
  tasks = new Map<number, BookTask[]>()
  newTaskTitle: Record<number, string> = {}

  constructor(private svc: BookService) {}

  ngOnInit() { this.load() }

  load() {
    this.svc.getAll().subscribe(data => {
      this.books = data
      data.forEach(b => {
        if (b.bookType === 'Technology') {
          this.svc.getTasks(b.id).subscribe(t => this.tasks.set(b.id, t))
        }
      })
      if (data.length === 0) return
      forkJoin(data.map(b => this.svc.getProgress(b.id))).subscribe(results => {
        data.forEach((b, i) => this.histories.set(b.id, results[i]))
        this.buildHistoryChart()
      })
    })
  }

  buildHistoryChart() {
    const dailyMap = new Map<string, number>()
    this.books.forEach(b => {
      const history = this.histories.get(b.id) ?? []
      history.forEach((entry, i) => {
        const pagesRead = i === 0 ? entry.currentPage : Math.max(entry.currentPage - history[i - 1].currentPage, 0)
        dailyMap.set(entry.date, (dailyMap.get(entry.date) ?? 0) + pagesRead)
      })
    })

    const sorted = Array.from(dailyMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))
    const dates = sorted.map(([d]) => d)
    const pages = sorted.map(([, p]) => p)

    this.histSeries = [{ name: 'Pages Read', data: pages }]
    this.histOpts = {
      chart: { type: 'area', height: 200, toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05 } },
      dataLabels: { enabled: false },
      xaxis: { categories: dates, tickAmount: 8, labels: { rotate: -30, style: { fontSize: '11px' } } },
      yaxis: { labels: { style: { fontSize: '11px' } }, min: 0 },
      colors: ['#0d6efd'],
      grid: { borderColor: '#e9ecef' },
      tooltip: { y: { formatter: (v: number) => v + ' pages' } },
    }
  }

  emptyForm(): Partial<Book> {
    return {
      title: '', author: '',
      totalPages: 0, currentPage: 0,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Reading',
      bookType: 'Literature',
      targetDate: undefined,
      notes: '',
    }
  }

  private today(): Date {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }

  // ---- Progress stats ----

  progressPct(b: Book): number {
    return b.totalPages > 0 ? (b.currentPage / b.totalPages) * 100 : 0
  }

  pagesRemaining(b: Book): number {
    return Math.max(b.totalPages - b.currentPage, 0)
  }

  daysReading(b: Book): number {
    const start = new Date(b.startDate)
    start.setHours(0, 0, 0, 0)
    return Math.max(Math.floor((this.today().getTime() - start.getTime()) / 86400000), 1)
  }

  dailyPace(b: Book): number {
    return b.currentPage === 0 ? 0 : b.currentPage / this.daysReading(b)
  }

  /** Uses last-7-day history for accuracy; falls back to lifetime average */
  recentPace(b: Book): number {
    const history = this.histories.get(b.id)
    if (!history || history.length < 2) return this.dailyPace(b)

    const cutoffMs = this.today().getTime() - 7 * 86400000
    const recent = history.filter(h => new Date(h.date).getTime() >= cutoffMs)
    const sample = recent.length >= 2 ? recent : history

    const oldest = sample[0]
    const newest = sample[sample.length - 1]
    const daysDiff = Math.max(
      (new Date(newest.date).getTime() - new Date(oldest.date).getTime()) / 86400000, 1
    )
    return Math.max((newest.currentPage - oldest.currentPage) / daysDiff, 0)
  }

  estimatedFinish(b: Book): string {
    const pace = this.recentPace(b)
    if (pace === 0) return '—'
    const remaining = this.pagesRemaining(b)
    if (remaining === 0) return 'Done!'
    const finish = new Date(this.today())
    finish.setDate(finish.getDate() + Math.ceil(remaining / pace))
    return finish.toISOString().split('T')[0]
  }

  daysToTarget(b: Book): number {
    if (!b.targetDate) return 0
    const target = new Date(b.targetDate)
    target.setHours(0, 0, 0, 0)
    return Math.floor((target.getTime() - this.today().getTime()) / 86400000)
  }

  requiredPace(b: Book): number {
    const days = this.daysToTarget(b)
    return days <= 0 ? 0 : this.pagesRemaining(b) / days
  }

  hasHistory(id: number): boolean {
    return (this.histories.get(id)?.length ?? 0) >= 2
  }

  // ---- History display ----

  historyDisplay(bookId: number): { date: string; currentPage: number; pagesRead: number }[] {
    const h = this.histories.get(bookId) ?? []
    return h.map((entry, i) => ({
      date: entry.date,
      currentPage: entry.currentPage,
      pagesRead: i === 0 ? entry.currentPage : Math.max(entry.currentPage - h[i - 1].currentPage, 0),
    })).reverse()
  }

  toggleHistory(id: number) {
    if (this.expandedHistory.has(id)) {
      this.expandedHistory.delete(id)
    } else {
      this.expandedHistory.add(id)
      if (!this.histories.has(id)) {
        this.svc.getProgress(id).subscribe(h => this.histories.set(id, h))
      }
    }
  }

  // ---- Quick page update ----

  toggleUpdate(b: Book) {
    if (this.expandedUpdate.has(b.id)) {
      this.expandedUpdate.delete(b.id)
    } else {
      this.expandedUpdate.add(b.id)
      if (this.updateForms[b.id] === undefined) {
        this.updateForms[b.id] = b.currentPage
      }
    }
  }

  saveProgress(b: Book) {
    const page = this.updateForms[b.id]
    if (page === undefined || page < 0 || page > b.totalPages) return
    this.svc.updateProgress(b.id, page).subscribe(() => {
      this.expandedUpdate.delete(b.id)
      delete this.updateForms[b.id]
      this.load()
    })
  }

  // ---- Lab Tasks ----

  toggleLabs(b: Book) {
    if (this.expandedLabs.has(b.id)) {
      this.expandedLabs.delete(b.id)
    } else {
      this.expandedLabs.add(b.id)
      this.loadTasks(b.id)
    }
  }

  loadTasks(bookId: number) {
    this.svc.getTasks(bookId).subscribe(t => this.tasks.set(bookId, t))
  }

  addTask(b: Book) {
    const title = (this.newTaskTitle[b.id] ?? '').trim()
    if (!title) return
    this.svc.createTask(b.id, title).subscribe(() => {
      this.newTaskTitle[b.id] = ''
      this.loadTasks(b.id)
    })
  }

  toggleTask(b: Book, t: BookTask) {
    this.svc.toggleTask(b.id, t.id, !t.isDone).subscribe(() => this.loadTasks(b.id))
  }

  deleteTask(b: Book, t: BookTask) {
    this.svc.deleteTask(b.id, t.id).subscribe(() => this.loadTasks(b.id))
  }

  totalCount(bookId: number): number {
    return (this.tasks.get(bookId) ?? []).length
  }

  doneCount(bookId: number): number {
    return (this.tasks.get(bookId) ?? []).filter(t => t.isDone).length
  }

  // ---- CRUD ----

  onStatusChange() {
    if (this.form.status === 'Completed') {
      this.form.currentPage = this.form.totalPages ?? 0
    }
  }

  openForm(b?: Book) {
    this.form = b ? { ...b } : this.emptyForm()
    this.showModal = true
  }

  closeForm() { this.showModal = false }

  save() {
    if (!this.form.targetDate) this.form.targetDate = undefined
    if (this.form.id) {
      this.svc.update(this.form as Book).subscribe(() => { this.load(); this.closeForm() })
    } else {
      this.svc.create(this.form as Omit<Book, 'id'>).subscribe(() => { this.load(); this.closeForm() })
    }
  }

  delete(id: number) {
    if (confirm('Delete this book?')) {
      this.svc.delete(id).subscribe(() => this.load())
    }
  }
}
