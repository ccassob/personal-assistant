import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { timeout } from 'rxjs/operators'
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

export interface UpsertTransactionRequest {
  date: string
  description: string
  amount: number
  type: string
  creditCardCategoryId?: number | null
  notes?: string | null
}

@Injectable({ providedIn: 'root' })
export class CreditCardService {
  private base = `${API_BASE}/api/credit-cards`
  private readonly STATEMENT_TIMEOUT_MS = 150_000

  constructor(private http: HttpClient) {}

  getCards(): Observable<CreditCard[]> { return this.http.get<CreditCard[]>(this.base) }
  createCard(c: Omit<CreditCard, 'id' | 'createdAt'>): Observable<CreditCard> { return this.http.post<CreditCard>(this.base, c) }
  updateCard(c: CreditCard): Observable<void> { return this.http.put<void>(`${this.base}/${c.id}`, c) }
  deleteCard(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`) }

  getStatements(cardId: number): Observable<CreditCardStatement[]> { return this.http.get<CreditCardStatement[]>(`${this.base}/${cardId}/statements`) }
  getStatement(id: number): Observable<CreditCardStatement> { return this.http.get<CreditCardStatement>(`${this.base}/statements/${id}`) }
  uploadStatement(cardId: number, file: File): Observable<CreditCardStatement> {
    const fd = new FormData()
    fd.append('file', file)
    return this.http.post<CreditCardStatement>(`${this.base}/${cardId}/statements`, fd)
      .pipe(timeout(this.STATEMENT_TIMEOUT_MS))
  }
  deleteStatement(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/statements/${id}`) }
  reprocessStatement(id: number): Observable<CreditCardStatement> {
    return this.http.post<CreditCardStatement>(`${this.base}/statements/${id}/reprocess`, {})
      .pipe(timeout(this.STATEMENT_TIMEOUT_MS))
  }

  getTransactions(statementId: number): Observable<CreditCardTransaction[]> { return this.http.get<CreditCardTransaction[]>(`${this.base}/statements/${statementId}/transactions`) }
  createTransaction(statementId: number, body: UpsertTransactionRequest): Observable<CreditCardTransaction> { return this.http.post<CreditCardTransaction>(`${this.base}/statements/${statementId}/transactions`, body) }
  updateTransaction(id: number, body: UpsertTransactionRequest): Observable<void> { return this.http.put<void>(`${this.base}/transactions/${id}`, body) }
  deleteTransaction(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/transactions/${id}`) }
}
