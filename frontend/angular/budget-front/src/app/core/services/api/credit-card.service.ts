import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { API_BASE } from '../../../constants'

export interface CreditCard {
  id: number
  name: string
  lastFourDigits: string
  color: string
  notes: string
  createdAt: string
}

export interface CreditCardStatement {
  id: number
  creditCardId: number
  fileName: string
  status: string
  errorMessage: string
  uploadedAt: string
  processedAt?: string
  statementMonth?: number
  statementYear?: number
  totalAmount?: number
  transactionCount: number
}

export interface CreditCardTransaction {
  id: number
  statementId: number
  date: string
  description: string
  amount: number
  type: string
  creditCardCategoryId?: number
  creditCardCategory?: { id: number; name: string; color: string; icon: string }
  notes: string
  isAiClassified: boolean
}

@Injectable({ providedIn: 'root' })
export class CreditCardService {
  private base = `${API_BASE}/api/credit-cards`

  constructor(private http: HttpClient) {}

  getCards(): Observable<CreditCard[]> { return this.http.get<CreditCard[]>(this.base) }
  createCard(c: Omit<CreditCard, 'id' | 'createdAt'>): Observable<CreditCard> { return this.http.post<CreditCard>(this.base, c) }
  updateCard(c: CreditCard): Observable<void> { return this.http.put<void>(`${this.base}/${c.id}`, c) }
  deleteCard(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`) }

  getStatements(cardId: number): Observable<CreditCardStatement[]> { return this.http.get<CreditCardStatement[]>(`${this.base}/${cardId}/statements`) }
  getStatement(id: number): Observable<CreditCardStatement> { return this.http.get<CreditCardStatement>(`${this.base}/statements/${id}`) }
  uploadStatement(cardId: number, file: File): Observable<{ statementId: number; status: string }> {
    const fd = new FormData()
    fd.append('file', file)
    return this.http.post<{ statementId: number; status: string }>(`${this.base}/${cardId}/statements`, fd)
  }
  deleteStatement(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/statements/${id}`) }

  getTransactions(statementId: number): Observable<CreditCardTransaction[]> { return this.http.get<CreditCardTransaction[]>(`${this.base}/statements/${statementId}/transactions`) }
  updateTransaction(id: number, body: { creditCardCategoryId?: number | null; notes: string; type: string }): Observable<void> { return this.http.put<void>(`${this.base}/transactions/${id}`, body) }
  deleteTransaction(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/transactions/${id}`) }
}
