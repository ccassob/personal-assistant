import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { API_BASE } from '../../../constants'
import { Category } from './category.service'
import { Transaction } from './transaction.service'

export interface RecurringTransaction {
  id: number
  description: string
  amount: number
  type: string
  categoryId: number
  category?: Category
  dayOfMonth: number
  notes: string
  isActive: boolean
}

@Injectable({ providedIn: 'root' })
export class RecurringTransactionService {
  private url = `${API_BASE}/api/recurring-transactions`
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<RecurringTransaction[]>(this.url) }
  getById(id: number) { return this.http.get<RecurringTransaction>(`${this.url}/${id}`) }
  create(t: Omit<RecurringTransaction, 'id' | 'category'>) { return this.http.post<RecurringTransaction>(this.url, t) }
  update(t: Omit<RecurringTransaction, 'category'>) { return this.http.put<void>(`${this.url}/${t.id}`, t) }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`) }

  generate(month: number, year: number) {
    const params = new HttpParams().set('month', month).set('year', year)
    return this.http.post<Transaction[]>(`${this.url}/generate`, null, { params })
  }
}
