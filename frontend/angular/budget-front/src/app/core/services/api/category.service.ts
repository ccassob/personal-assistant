import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { API_BASE } from '../../../constants'

export interface Category {
  id: number
  name: string
  type: string
  color: string
  icon: string
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private url = `${API_BASE}/api/categories`
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Category[]>(this.url) }
  getById(id: number) { return this.http.get<Category>(`${this.url}/${id}`) }
  create(c: Omit<Category, 'id'>) { return this.http.post<Category>(this.url, c) }
  update(c: Category) { return this.http.put<void>(`${this.url}/${c.id}`, c) }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`) }
}
