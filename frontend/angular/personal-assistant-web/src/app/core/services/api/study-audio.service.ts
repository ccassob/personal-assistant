import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { API_BASE } from '../../../constants'

export interface StudyAudioSession {
  sessionNumber: number
  theorySectionId: number
  sectionTitle: string
  questionCount: number
  ssml: string
  status: string | null
  hasAudio: boolean
  generatedAt: string | null
}

@Injectable({ providedIn: 'root' })
export class StudyAudioService {
  private base = `${API_BASE}/api/technologies`

  constructor(private http: HttpClient) {}

  list(techId: number): Observable<StudyAudioSession[]> {
    return this.http.get<StudyAudioSession[]>(`${this.base}/${techId}/study-audio`)
  }

  saveSsml(techId: number, sectionId: number, ssml: string): Observable<unknown> {
    return this.http.put(`${this.base}/${techId}/study-audio/${sectionId}/ssml`, { ssml })
  }

  generate(techId: number, sectionId: number): Observable<unknown> {
    return this.http.post(`${this.base}/${techId}/study-audio/${sectionId}/generate`, {})
  }

  getFile(techId: number, sectionId: number): Observable<Blob> {
    return this.http.get(`${this.base}/${techId}/study-audio/${sectionId}/file`, { responseType: 'blob' })
  }

  delete(techId: number, sectionId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${techId}/study-audio/${sectionId}`)
  }
}
