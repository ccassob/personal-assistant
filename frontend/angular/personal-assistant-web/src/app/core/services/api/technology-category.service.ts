import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { API_BASE } from '../../../constants'

export interface TechnologyCategory {
  id: number
  name: string
  color: string
  icon: string
}

@Injectable({ providedIn: 'root' })
export class TechnologyCategoryService {
  private url = `${API_BASE}/api/technology-categories`
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<TechnologyCategory[]>(this.url) }
  create(c: Omit<TechnologyCategory, 'id'>) { return this.http.post<TechnologyCategory>(this.url, c) }
  update(c: TechnologyCategory) { return this.http.put<void>(`${this.url}/${c.id}`, c) }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`) }
}
