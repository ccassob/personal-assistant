import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { API_BASE } from '../../../constants'
import { Category } from './category.service'

export interface Transaction {
  id: number
  date: string
  amount: number
  description: string
  type: string
  categoryId: number
  category?: Category
  notes: string
  isExecuted: boolean
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private url = `${API_BASE}/api/transactions`
  constructor(private http: HttpClient) {}

  getAll(filters?: { categoryId?: number; type?: string; month?: number; year?: number }) {
    let params = new HttpParams()
    if (filters?.categoryId) params = params.set('categoryId', filters.categoryId)
    if (filters?.type) params = params.set('type', filters.type)
    if (filters?.month) params = params.set('month', filters.month)
    if (filters?.year) params = params.set('year', filters.year)
    return this.http.get<Transaction[]>(this.url, { params })
  }

  create(t: Omit<Transaction, 'id' | 'category'>) { return this.http.post<Transaction>(this.url, t) }
  update(t: Omit<Transaction, 'category'>) { return this.http.put<void>(`${this.url}/${t.id}`, t) }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`) }
  deleteAll(filters?: { categoryId?: number; type?: string; month?: number; year?: number }) {
    let params = new HttpParams()
    if (filters?.categoryId) params = params.set('categoryId', filters.categoryId)
    if (filters?.type) params = params.set('type', filters.type)
    if (filters?.month) params = params.set('month', filters.month)
    if (filters?.year) params = params.set('year', filters.year)
    return this.http.delete<{ deleted: number }>(this.url, { params })
  }
  import(rows: ImportRow[]) { return this.http.post<{ imported: number; errors: number }>(`${this.url}/import`, rows) }
}

export interface ImportRow {
  date: string
  description: string
  amount: number
  type: string
  category?: string
  notes?: string
  isExecuted: boolean
}
