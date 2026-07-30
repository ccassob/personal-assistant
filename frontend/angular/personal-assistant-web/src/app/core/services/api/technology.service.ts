import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { API_BASE } from '../../../constants'

export interface Technology {
  id: number
  name: string
  color: string
  icon: string
  notes: string
  categoryId: number | null
  categoryName: string | null
  categoryColor: string | null
  categoryIcon: string | null
  practiceEarnedPoints: number
  practiceTotalPoints: number
  theoryEarnedPoints: number
  theoryTotalPoints: number
  totalScore: number
  level: string
}

export interface TechnologyPracticeSection {
  id: number
  technologyId: number
  title: string
}

export interface TechnologyPracticeItem {
  id: number
  sectionId: number
  title: string
  subcategory: string
  points: number
  order: number
  isDone: boolean
  completedAt?: string
  notes: string
}

export interface TechnologyTheorySection {
  id: number
  technologyId: number
  title: string
}

export interface TechnologyTheoryQuestion {
  id: number
  sectionId: number
  question: string
  subcategory: string
  points: number
  order: number
  isMastered: boolean
  answeredAt?: string
  notes: string
}

export interface ImportTopicsResult {
  imported: number
  skipped: number
  errors: string[]
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export interface TechnologyCompletionHistoryEntry {
  sectionTitle: string
  itemTitle: string
  itemType: 0 | 1 // 0 = Practice, 1 = Theory (backend TopicType enum, serialized as its numeric value)
  points: number
  completedDate: string
}

export function levelBadgeClass(level: string): string {
  switch (level) {
    case 'Básico': return 'bg-info text-dark'
    case 'Intermedio': return 'bg-primary'
    case 'Avanzado': return 'bg-warning text-dark'
    case 'Experto': return 'bg-success'
    case 'Dominio demostrado': return 'bg-dark'
    default: return 'bg-secondary' // Principiante
  }
}

@Injectable({ providedIn: 'root' })
export class TechnologyService {
  private url = `${API_BASE}/api/technologies`

  constructor(private http: HttpClient) {}

  getAll(): Observable<Technology[]> { return this.http.get<Technology[]>(this.url) }
  getById(id: number): Observable<Technology> { return this.http.get<Technology>(`${this.url}/${id}`) }
  getPaged(search: string, page: number, pageSize: number): Observable<PagedResult<Technology>> {
    const params = new URLSearchParams({ search: search ?? '', page: String(page), pageSize: String(pageSize) })
    return this.http.get<PagedResult<Technology>>(`${this.url}/paged?${params}`)
  }
  create(t: { name: string; color: string; icon: string; notes: string; categoryId: number | null }): Observable<Technology> { return this.http.post<Technology>(this.url, t) }
  update(t: { id: number; name: string; color: string; icon: string; notes: string; categoryId: number | null }): Observable<void> { return this.http.put<void>(`${this.url}/${t.id}`, t) }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`) }

  getPracticeSections(techId: number): Observable<TechnologyPracticeSection[]> { return this.http.get<TechnologyPracticeSection[]>(`${this.url}/${techId}/practice-sections`) }
  createPracticeSection(techId: number, title: string): Observable<TechnologyPracticeSection> { return this.http.post<TechnologyPracticeSection>(`${this.url}/${techId}/practice-sections`, { title }) }
  deletePracticeSection(techId: number, sectionId: number): Observable<void> { return this.http.delete<void>(`${this.url}/${techId}/practice-sections/${sectionId}`) }

  getPracticeItems(techId: number): Observable<TechnologyPracticeItem[]> { return this.http.get<TechnologyPracticeItem[]>(`${this.url}/${techId}/practice-items`) }
  createPracticeItem(techId: number, sectionId: number, title: string, points: number, subcategory?: string): Observable<TechnologyPracticeItem> {
    return this.http.post<TechnologyPracticeItem>(`${this.url}/${techId}/practice-items`, { sectionId, title, points, subcategory })
  }
  updatePracticeItem(techId: number, itemId: number, isDone: boolean, notes?: string): Observable<TechnologyPracticeItem> {
    return this.http.put<TechnologyPracticeItem>(`${this.url}/${techId}/practice-items/${itemId}`, { isDone, notes })
  }
  deletePracticeItem(techId: number, itemId: number): Observable<void> { return this.http.delete<void>(`${this.url}/${techId}/practice-items/${itemId}`) }

  getTheorySections(techId: number): Observable<TechnologyTheorySection[]> { return this.http.get<TechnologyTheorySection[]>(`${this.url}/${techId}/theory-sections`) }
  createTheorySection(techId: number, title: string): Observable<TechnologyTheorySection> { return this.http.post<TechnologyTheorySection>(`${this.url}/${techId}/theory-sections`, { title }) }
  deleteTheorySection(techId: number, sectionId: number): Observable<void> { return this.http.delete<void>(`${this.url}/${techId}/theory-sections/${sectionId}`) }

  getTheoryQuestions(techId: number): Observable<TechnologyTheoryQuestion[]> { return this.http.get<TechnologyTheoryQuestion[]>(`${this.url}/${techId}/theory-questions`) }
  createTheoryQuestion(techId: number, sectionId: number, question: string, points: number, subcategory?: string): Observable<TechnologyTheoryQuestion> {
    return this.http.post<TechnologyTheoryQuestion>(`${this.url}/${techId}/theory-questions`, { sectionId, question, points, subcategory })
  }
  updateTheoryQuestion(techId: number, questionId: number, isMastered: boolean, notes?: string): Observable<TechnologyTheoryQuestion> {
    return this.http.put<TechnologyTheoryQuestion>(`${this.url}/${techId}/theory-questions/${questionId}`, { isMastered, notes })
  }
  deleteTheoryQuestion(techId: number, questionId: number): Observable<void> { return this.http.delete<void>(`${this.url}/${techId}/theory-questions/${questionId}`) }

  importCsv(techId: number, csv: string): Observable<ImportTopicsResult> {
    return this.http.post<ImportTopicsResult>(`${this.url}/${techId}/import-csv`, { csv })
  }

  getCompletionHistory(): Observable<TechnologyCompletionHistoryEntry[]> {
    return this.http.get<TechnologyCompletionHistoryEntry[]>(`${this.url}/history`)
  }
}
