import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { API_BASE } from '../../../constants'

export interface Book {
  id: number
  title: string
  author: string
  totalPages: number
  currentPage: number
  startDate: string
  status: string
  bookType: string
  lastUpdated?: string
  targetDate?: string
  notes: string
}

export interface BookProgress {
  id: number
  bookId: number
  date: string
  currentPage: number
}

export interface BookTask {
  id: number
  bookId: number
  title: string
  isDone: boolean
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private url = `${API_BASE}/api/books`
  constructor(private http: HttpClient) {}

  getAll()                        { return this.http.get<Book[]>(this.url) }
  create(b: Omit<Book, 'id'>)    { return this.http.post<Book>(this.url, b) }
  update(b: Book)                 { return this.http.put<void>(`${this.url}/${b.id}`, b) }
  delete(id: number)              { return this.http.delete<void>(`${this.url}/${id}`) }

  getProgress(id: number)         { return this.http.get<BookProgress[]>(`${this.url}/${id}/progress`) }
  updateProgress(id: number, currentPage: number) {
    return this.http.post<Book>(`${this.url}/${id}/progress`, { currentPage })
  }

  getTasks(bookId: number)        { return this.http.get<BookTask[]>(`${this.url}/${bookId}/tasks`) }
  createTask(bookId: number, title: string) {
    return this.http.post<BookTask>(`${this.url}/${bookId}/tasks`, { title })
  }
  toggleTask(bookId: number, taskId: number, isDone: boolean) {
    return this.http.put<BookTask>(`${this.url}/${bookId}/tasks/${taskId}`, { isDone })
  }
  deleteTask(bookId: number, taskId: number) {
    return this.http.delete<void>(`${this.url}/${bookId}/tasks/${taskId}`)
  }
}
