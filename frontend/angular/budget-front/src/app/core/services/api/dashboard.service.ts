import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { API_BASE } from '../../../constants'

export interface TrendPoint {
  month: number
  year: number
  label: string
  income: number
  expense: number
}

export interface DashboardSummary {
  totalIncome: number
  totalExpense: number
  netBalance: number
  spendingByCategory: { categoryId: number; categoryName: string; color: string; amount: number }[]
  budgetVsActual: { categoryId: number; categoryName: string; target: number; actual: number }[]
  goals: { id: number; name: string; targetAmount: number; currentAmount: number; status: string }[]
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private url = `${API_BASE}/api/dashboard`
  constructor(private http: HttpClient) {}

  getSummary(month: number, year: number) {
    const params = new HttpParams().set('month', month).set('year', year)
    return this.http.get<DashboardSummary>(`${this.url}/summary`, { params })
  }

  getTrend(months: number) {
    const params = new HttpParams().set('months', months)
    return this.http.get<TrendPoint[]>(`${this.url}/trend`, { params })
  }
}
