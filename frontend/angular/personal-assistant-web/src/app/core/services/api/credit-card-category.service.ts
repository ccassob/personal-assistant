import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { API_BASE } from '../../../constants'

export interface CreditCardCategory {
  id: number
  name: string
  color: string
  icon: string
}

@Injectable({ providedIn: 'root' })
export class CreditCardCategoryService {
  private url = `${API_BASE}/api/credit-card-categories`
  constructor(private http: HttpClient) {}

  getAll(): Observable<CreditCardCategory[]> { return this.http.get<CreditCardCategory[]>(this.url) }
  create(c: Omit<CreditCardCategory, 'id'>): Observable<CreditCardCategory> { return this.http.post<CreditCardCategory>(this.url, c) }
  update(c: CreditCardCategory): Observable<void> { return this.http.put<void>(`${this.url}/${c.id}`, c) }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`) }
}
