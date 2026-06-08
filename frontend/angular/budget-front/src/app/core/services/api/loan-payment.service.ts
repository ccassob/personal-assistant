import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { API_BASE } from '../../../constants'

export interface LoanPayment {
  id: number
  loanId: number
  date: string
  principalAmount: number
  interestAmount: number
  insuranceAmount: number
  additionalPrincipal: number
}

@Injectable({ providedIn: 'root' })
export class LoanPaymentService {
  private base = `${API_BASE}/api/loans`

  constructor(private http: HttpClient) {}

  getByLoan(loanId: number): Observable<LoanPayment[]> {
    return this.http.get<LoanPayment[]>(`${this.base}/${loanId}/payments`)
  }

  create(loanId: number, payment: Omit<LoanPayment, 'id' | 'loanId'>): Observable<LoanPayment> {
    return this.http.post<LoanPayment>(`${this.base}/${loanId}/payments`, payment)
  }

  update(loanId: number, payment: LoanPayment): Observable<void> {
    return this.http.put<void>(`${this.base}/${loanId}/payments/${payment.id}`, payment)
  }

  delete(loanId: number, paymentId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${loanId}/payments/${paymentId}`)
  }
}
