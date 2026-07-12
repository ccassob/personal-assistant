import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { API_BASE } from '../../../constants'

export interface Loan {
  id: number
  name: string
  loanAmount: number
  startDate: string
  interestRate: number
  monthlyPayment: number
  termMonths: number
  insuranceAmount: number
  currentBalance: number
  goalAmount?: number
  goalDate?: string
}

@Injectable({ providedIn: 'root' })
export class LoanService {
  private url = `${API_BASE}/api/loans`
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Loan[]>(this.url) }
  create(l: Omit<Loan, 'id'>) { return this.http.post<Loan>(this.url, l) }
  update(l: Loan) { return this.http.put<void>(`${this.url}/${l.id}`, l) }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`) }
}
