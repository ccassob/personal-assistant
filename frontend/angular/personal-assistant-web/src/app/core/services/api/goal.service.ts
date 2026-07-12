import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { API_BASE } from '../../../constants'

export interface Goal {
  id: number
  name: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: string
  status: string
}

@Injectable({ providedIn: 'root' })
export class GoalService {
  private url = `${API_BASE}/api/goals`
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Goal[]>(this.url) }
  create(g: Omit<Goal, 'id'>) { return this.http.post<Goal>(this.url, g) }
  update(g: Goal) { return this.http.put<void>(`${this.url}/${g.id}`, g) }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`) }
}
