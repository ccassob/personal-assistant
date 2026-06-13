import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppSettings, AppSettingsService } from '../../core/services/api/app-settings.service'
import { PushNotificationService } from '../../core/services/push-notification.service'

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
              <h5 class="card-title mb-0">Vehicle Distance Unit</h5>
            </div>
            <div class="card-body">
              <div class="form-text mb-3">Unit used for mileage across all vehicles.</div>
              <div class="d-flex gap-3">
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="unitKm" [(ngModel)]="distanceUnit" value="km">
                  <label class="form-check-label" for="unitKm">Kilometers (km)</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="unitMi" [(ngModel)]="distanceUnit" value="mi">
                  <label class="form-check-label" for="unitMi">Miles (mi)</label>
                </div>
              </div>
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

        <div class="col-md-6 col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Connection</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">API Base URL</label>
                <input type="url" class="form-control" [(ngModel)]="apiUrl" placeholder="http://192.168.1.x:8002">
                <div class="form-text">Override the API server address (useful when accessing from phone over local Wi-Fi). Leave blank to use the default.</div>
              </div>
              <button class="btn btn-sm btn-outline-secondary" (click)="clearApiUrl()">Reset to default</button>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Push Notifications</h5>
            </div>
            <div class="card-body">
              @if (!push.isSupported()) {
                <div class="alert alert-secondary py-2 mb-0">
                  <small>Push notifications are not supported in this browser or environment.</small>
                </div>
              } @else if (push.permissionStatus === 'denied') {
                <div class="alert alert-warning py-2 mb-0">
                  <small>Notifications are blocked. Enable them in your browser or device settings, then reload.</small>
                </div>
              } @else {
                <p class="text-muted small mb-3">
                  Receive alerts for expired transactions and upcoming vehicle maintenance when you open the app.
                </p>
                @if (push.isSubscribed()) {
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <span class="badge bg-success">Enabled</span>
                    <span class="text-muted small">Notifications are active on this device.</span>
                  </div>
                  <button class="btn btn-sm btn-outline-danger" (click)="disableNotifications()" [disabled]="pushWorking">
                    Disable
                  </button>
                } @else {
                  <button class="btn btn-sm btn-primary" (click)="enableNotifications()" [disabled]="pushWorking">
                    Enable Notifications
                  </button>
                }
                @if (pushMessage) {
                  <div class="mt-2 text-muted small">{{ pushMessage }}</div>
                }
              }
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
  distanceUnit = 'km'
  apiUrl = ''
  saved = false
  private settingsId = 1

  pushWorking = false
  pushMessage = ''

  constructor(private svc: AppSettingsService, public push: PushNotificationService) {}


  ngOnInit() {
    this.apiUrl = localStorage.getItem('__BUDGET_API_URL__') ?? ''
    this.svc.get().subscribe(s => {
      this.settingsId = s.id
      this.cutoffDay = s.cutoffDay
      this.pastColor = s.pastColor
      this.todayColor = s.todayColor
      this.futureColor = s.futureColor
      this.distanceUnit = s.distanceUnit ?? 'km'
    })
  }

  enableNotifications() {
    this.pushWorking = true
    this.pushMessage = ''
    this.push.subscribe().subscribe({
      next: () => { this.pushWorking = false; this.pushMessage = 'Notifications enabled.' },
      error: () => { this.pushWorking = false; this.pushMessage = 'Failed to enable notifications.' }
    })
  }

  disableNotifications() {
    this.pushWorking = true
    this.pushMessage = ''
    this.push.unsubscribe().subscribe({
      next: () => { this.pushWorking = false; this.pushMessage = 'Notifications disabled.' },
      error: () => { this.pushWorking = false; this.pushMessage = 'Failed to disable notifications.' }
    })
  }

  clearApiUrl() {
    this.apiUrl = ''
    localStorage.removeItem('__BUDGET_API_URL__')
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
    if (this.apiUrl.trim()) {
      localStorage.setItem('__BUDGET_API_URL__', this.apiUrl.trim())
    } else {
      localStorage.removeItem('__BUDGET_API_URL__')
    }
    const clamped = Math.min(31, Math.max(1, this.cutoffDay))
    this.svc.update({
      id: this.settingsId,
      cutoffDay: clamped,
      pastColor: this.pastColor,
      todayColor: this.todayColor,
      futureColor: this.futureColor,
      distanceUnit: this.distanceUnit
    }).subscribe(s => {
      this.cutoffDay = s.cutoffDay
      this.pastColor = s.pastColor
      this.todayColor = s.todayColor
      this.futureColor = s.futureColor
      this.distanceUnit = s.distanceUnit ?? 'km'
      this.saved = true
      setTimeout(() => this.saved = false, 3000)
    })
  }
}
