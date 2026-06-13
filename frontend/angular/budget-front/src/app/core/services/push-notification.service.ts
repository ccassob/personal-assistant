import { Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { SwPush } from '@angular/service-worker'
import { Observable, from } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { API_BASE } from '../../constants'

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private url = `${API_BASE}/api/notifications`
  isSubscribed = signal(false)
  isSupported = signal(false)

  constructor(private swPush: SwPush, private http: HttpClient) {
    this.isSupported.set(swPush.isEnabled)
    swPush.subscription.subscribe(sub => this.isSubscribed.set(sub !== null))
  }

  getPublicKey(): Observable<string> {
    return this.http.get<{ publicKey: string }>(`${this.url}/public-key`)
      .pipe(map(r => r.publicKey))
  }

  subscribe(): Observable<void> {
    return this.getPublicKey().pipe(
      switchMap(key => from(this.swPush.requestSubscription({ serverPublicKey: key }))),
      switchMap(sub => this.http.post<void>(`${this.url}/subscribe`, {
        endpoint: sub.endpoint,
        p256dh: this.arrayBufferToBase64(sub.getKey('p256dh')),
        auth: this.arrayBufferToBase64(sub.getKey('auth'))
      }))
    )
  }

  unsubscribe(): Observable<void> {
    return from(this.swPush.unsubscribe()).pipe(
      switchMap(() => this.http.delete<void>(`${this.url}/subscribe`,
        { body: { endpoint: '' } }))
    )
  }

  dispatch(): void {
    if (!this.isSubscribed()) return
    this.http.post(`${this.url}/dispatch`, {}).subscribe()
  }

  get permissionStatus(): string {
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission // 'default' | 'granted' | 'denied'
  }

  private arrayBufferToBase64(buf: ArrayBuffer | null): string {
    if (!buf) return ''
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
  }
}
