import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { API_BASE } from '../../../constants'

export interface Account {
  id: number
  name: string
  amount: number
  lastModified: string
}

export interface AccountHistory {
  date: string
  amount: number
}

export interface AccountHistoryTotal {
  date: string
  totalAmount: number
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private url = `${API_BASE}/api/accounts`
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Account[]>(this.url) }
  create(a: Pick<Account, 'name' | 'amount'>) { return this.http.post<Account>(this.url, a) }
  update(a: Account) { return this.http.put<void>(`${this.url}/${a.id}`, a) }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`) }
  getHistory(id: number) { return this.http.get<AccountHistory[]>(`${this.url}/${id}/history`) }
  getTotalHistory() { return this.http.get<AccountHistoryTotal[]>(`${this.url}/history/total`) }
}
