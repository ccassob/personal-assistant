import { Injectable, OnDestroy, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { getApiBase } from '../../constants'

@Injectable({ providedIn: 'root' })
export class ConnectivityService implements OnDestroy {
  readonly isOnline = signal(navigator.onLine)

  private intervalId: ReturnType<typeof setInterval> | null = null

  constructor(private http: HttpClient) {
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
    this.intervalId = setInterval(() => this.ping(), 15000)
    this.ping()
  }

  private handleOnline = () => this.isOnline.set(true)
  private handleOffline = () => this.isOnline.set(false)

  private ping() {
    this.http.get(`${getApiBase()}/api/health`, { observe: 'response' }).subscribe({
      next: () => this.isOnline.set(true),
      error: () => this.isOnline.set(false),
    })
  }

  ngOnDestroy() {
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
    if (this.intervalId !== null) clearInterval(this.intervalId)
  }
}
