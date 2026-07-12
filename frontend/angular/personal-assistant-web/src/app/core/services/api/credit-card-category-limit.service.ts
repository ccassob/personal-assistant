import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { API_BASE } from '../../../constants'

export interface CcLimitYearRow {
  creditCardCategoryId: number
  creditCardCategoryName: string
  month: number
  year: number
  amount: number
  actualSpent: number
}

@Injectable({ providedIn: 'root' })
export class CreditCardCategoryLimitService {
  private url = `${API_BASE}/api/credit-card-category-limits`
  constructor(private http: HttpClient) {}

  getYearSummary(year: number) {
    return this.http.get<CcLimitYearRow[]>(`${this.url}/year-summary`, { params: new HttpParams().set('year', year) })
  }

  upsert(req: { creditCardCategoryId: number; month: number; year: number; amount: number }) {
    return this.http.post<{ id: number }>(`${this.url}/upsert`, req)
  }
}
