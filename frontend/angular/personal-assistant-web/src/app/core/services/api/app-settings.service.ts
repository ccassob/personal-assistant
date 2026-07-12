import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { API_BASE } from '../../../constants'

export interface AppSettings {
  id: number
  cutoffDay: number
  pastColor: string
  todayColor: string
  futureColor: string
  distanceUnit: string // "km" | "mi"
}

@Injectable({ providedIn: 'root' })
export class AppSettingsService {
  private url = `${API_BASE}/api/app-settings`
  constructor(private http: HttpClient) {}

  get() { return this.http.get<AppSettings>(this.url) }
  update(s: AppSettings) { return this.http.put<AppSettings>(this.url, s) }
}
