import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { API_BASE } from '../../../constants'

export interface GroceryCategory {
  id: number
  name: string
  color: string
  userId: string
}

export interface Supermarket {
  id: number
  name: string
  userId: string
}

export interface GroceryItem {
  id: number
  name: string
  barcode?: string
  manufacturer?: string
  groceryCategoryId?: number
  unitType: string
  isOnList: boolean
  lastPrice?: number
  lastQuantity?: number
  lastSupermarketId?: number
  supermarketIds: number[]
  userId: string
}

export interface GroceryPurchase {
  id: number
  groceryItemId: number
  supermarketId: number
  purchasedAt: string
  price: number
  quantity: number
  userId: string
}

@Injectable({ providedIn: 'root' })
export class GroceryService {
  private base = `${API_BASE}/api`
  constructor(private http: HttpClient) {}

  // Categories
  getCategories()                          { return this.http.get<GroceryCategory[]>(`${this.base}/grocery-categories`) }
  createCategory(c: Partial<GroceryCategory>) { return this.http.post<GroceryCategory>(`${this.base}/grocery-categories`, c) }
  updateCategory(c: GroceryCategory)       { return this.http.put<void>(`${this.base}/grocery-categories/${c.id}`, c) }
  deleteCategory(id: number)               { return this.http.delete<void>(`${this.base}/grocery-categories/${id}`) }

  // Supermarkets
  getSupermarkets()                        { return this.http.get<Supermarket[]>(`${this.base}/supermarkets`) }
  createSupermarket(s: Partial<Supermarket>) { return this.http.post<Supermarket>(`${this.base}/supermarkets`, s) }
  updateSupermarket(s: Supermarket)        { return this.http.put<void>(`${this.base}/supermarkets/${s.id}`, s) }
  deleteSupermarket(id: number)            { return this.http.delete<void>(`${this.base}/supermarkets/${id}`) }

  // Items
  getItems(params?: { onList?: boolean; supermarketId?: number }) {
    let url = `${this.base}/grocery-items`
    const qs: string[] = []
    if (params?.onList) qs.push('onList=true')
    if (params?.supermarketId) qs.push(`supermarketId=${params.supermarketId}`)
    if (qs.length) url += '?' + qs.join('&')
    return this.http.get<GroceryItem[]>(url)
  }
  createItem(i: Partial<GroceryItem>)      { return this.http.post<GroceryItem>(`${this.base}/grocery-items`, i) }
  updateItem(i: GroceryItem)               { return this.http.put<void>(`${this.base}/grocery-items/${i.id}`, i) }
  deleteItem(id: number)                   { return this.http.delete<void>(`${this.base}/grocery-items/${id}`) }
  toggleList(id: number)                   { return this.http.patch<GroceryItem>(`${this.base}/grocery-items/${id}/toggle-list`, {}) }

  // Purchases
  purchase(id: number, body: { supermarketId: number; price: number; quantity: number }) {
    return this.http.post<GroceryPurchase>(`${this.base}/grocery-items/${id}/purchase`, body)
  }
  getAllPurchases()                         { return this.http.get<GroceryPurchase[]>(`${this.base}/grocery-items/purchases`) }
}
