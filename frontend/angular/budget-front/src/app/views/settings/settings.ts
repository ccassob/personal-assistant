import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppSettings, AppSettingsService } from '../../core/services/api/app-settings.service'

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box">
            <h4 class="page-title">Settings</h4>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-md-6 col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Billing Period</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Cutoff Day <span class="text-muted">(1 – 31)</span></label>
                <input type="number" class="form-control" [(ngModel)]="cutoffDay" min="1" max="31" style="width:100px">
                <div class="form-text">Transactions are grouped from this day of the month to the day before in the next month.</div>
              </div>

              @if (cutoffDay >= 1 && cutoffDay <= 31) {
                <div class="alert alert-info py-2 mb-3">
                  <small>
                    <strong>Preview:</strong> Current period is
                    {{ periodLabel }}
                  </small>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Transaction Date Tags</h5>
            </div>
            <div class="card-body">
              <div class="form-text mb-3">Color badges shown on transactions based on their date. Tags are hidden when a transaction is marked as Executed.</div>
              <div class="mb-3 d-flex align-items-center gap-3">
                <label class="form-label mb-0" style="width:60px">Past</label>
                <input type="color" class="form-control form-control-color" [(ngModel)]="pastColor" style="width:50px;height:36px">
                <span class="badge rounded-pill" [style.background-color]="pastColor">Past</span>
              </div>
              <div class="mb-3 d-flex align-items-center gap-3">
                <label class="form-label mb-0" style="width:60px">Today</label>
                <input type="color" class="form-control form-control-color" [(ngModel)]="todayColor" style="width:50px;height:36px">
                <span class="badge rounded-pill" [style.background-color]="todayColor">Today</span>
              </div>
              <div class="mb-3 d-flex align-items-center gap-3">
                <label class="form-label mb-0" style="width:60px">Future</label>
                <input type="color" class="form-control form-control-color" [(ngModel)]="futureColor" style="width:50px;height:36px">
                <span class="badge rounded-pill" [style.background-color]="futureColor">Future</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-12">
          @if (saved) {
            <div class="alert alert-success py-2 mb-3" style="max-width:400px">Settings saved successfully.</div>
          }
          <button class="btn btn-primary" (click)="save()">
            <iconify-icon icon="tabler:device-floppy" width="16"></iconify-icon> Save
          </button>
        </div>
      </div>
    </div>
  `,
})
export class Settings implements OnInit {
  cutoffDay = 1
  pastColor = '#6c757d'
  todayColor = '#0d6efd'
  futureColor = '#fd7e14'
  saved = false
  private settingsId = 1

  constructor(private svc: AppSettingsService) {}

  ngOnInit() {
    this.svc.get().subscribe(s => {
      this.settingsId = s.id
      this.cutoffDay = s.cutoffDay
      this.pastColor = s.pastColor
      this.todayColor = s.todayColor
      this.futureColor = s.futureColor
    })
  }

  get periodLabel(): string {
    const now = new Date()
    const { start, end } = this.computePeriod(this.cutoffDay, now.getMonth() + 1, now.getFullYear())
    return `${this.fmt(start)} – ${this.fmt(end)}`
  }

  computePeriod(cutoffDay: number, month: number, year: number) {
    const daysInMonth = new Date(year, month, 0).getDate()
    const day = Math.min(cutoffDay, daysInMonth)
    const start = new Date(year, month - 1, day)
    const end = new Date(year, month, day)
    end.setDate(end.getDate() - 1)
    return { start, end }
  }

  fmt(d: Date) {
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  save() {
    const clamped = Math.min(31, Math.max(1, this.cutoffDay))
    this.svc.update({
      id: this.settingsId,
      cutoffDay: clamped,
      pastColor: this.pastColor,
      todayColor: this.todayColor,
      futureColor: this.futureColor
    }).subscribe(s => {
      this.cutoffDay = s.cutoffDay
      this.pastColor = s.pastColor
      this.todayColor = s.todayColor
      this.futureColor = s.futureColor
      this.saved = true
      setTimeout(() => this.saved = false, 3000)
    })
  }
}
