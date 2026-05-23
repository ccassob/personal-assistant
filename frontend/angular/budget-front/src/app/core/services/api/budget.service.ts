import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { API_BASE } from '../../../constants'
import { Category } from './category.service'

export interface Budget {
  id: number
  categoryId: number
  category?: Category
  month: number
  year: number
  targetAmount: number
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private url = `${API_BASE}/api/budgets`
  constructor(private http: HttpClient) {}

  getAll(month?: number, year?: number) {
    let params = new HttpParams()
    if (month) params = params.set('month', month)
    if (year) params = params.set('year', year)
    return this.http.get<Budget[]>(this.url, { params })
  }

  create(b: Omit<Budget, 'id' | 'category'>) { return this.http.post<Budget>(this.url, b) }
  update(b: Omit<Budget, 'category'>) { return this.http.put<void>(`${this.url}/${b.id}`, b) }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`) }
}
