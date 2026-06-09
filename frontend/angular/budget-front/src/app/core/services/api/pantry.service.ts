import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { getApiBase } from '../../../constants'

export interface PantryItem {
  id: number
  groceryItemId?: number
  name: string
  quantity: number
  unitType: string
  purchasedAt: string
  expiresAt?: string
  notes?: string
  userId: string
}

@Injectable({ providedIn: 'root' })
export class PantryService {
  constructor(private http: HttpClient) {}

  private base() { return `${getApiBase()}/api/pantry` }

  getItems(filter?: 'expiring' | 'expired'): Observable<PantryItem[]> {
    const params = filter ? `?filter=${filter}` : ''
    return this.http.get<PantryItem[]>(`${this.base()}${params}`)
  }

  createItem(data: Partial<PantryItem>): Observable<PantryItem> {
    return this.http.post<PantryItem>(this.base(), data)
  }

  updateItem(id: number, data: Partial<PantryItem>): Observable<PantryItem> {
    return this.http.put<PantryItem>(`${this.base()}/${id}`, data)
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base()}/${id}`)
  }

  consume(id: number, amount: number): Observable<any> {
    return this.http.patch(`${this.base()}/${id}/consume`, { amount })
  }
}
