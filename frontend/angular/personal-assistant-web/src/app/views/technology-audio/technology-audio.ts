import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Technology, TechnologyTheoryQuestion, TechnologyService } from '../../core/services/api/technology.service'
import { StudyAudioSession, StudyAudioService } from '../../core/services/api/study-audio.service'

@Component({
  selector: 'app-technology-audio',
  imports: [FormsModule, RouterLink, RouterLinkActive, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box">
            <h4 class="page-title">Tech Mastery</h4>
          </div>
        </div>
      </div>

      <!-- Tech Mastery sub-nav -->
      <div class="row mb-1">
        <div class="col-12">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link" routerLink="/technologies" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Catálogo</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/technology-dashboard" routerLinkActive="active">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/technology-audio" routerLinkActive="active">Audios</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                <iconify-icon icon="tabler:headphones" width="22" class="text-primary"></iconify-icon>
                <h5 class="card-title mb-0 me-2">Audios de estudio</h5>
                <select class="form-select w-auto" [(ngModel)]="selectedTechId" (ngModelChange)="onTechChange()">
                  <option [ngValue]="null" disabled>Selecciona una tecnología…</option>
                  @for (t of technologies; track t.id) {
                    <option [ngValue]="t.id">{{ t.name }}</option>
                  }
                </select>
              </div>
              <p class="text-muted small mb-0">
                Cada sección de teoría es una sesión. Copia sus preguntas, genera el SSML por tu cuenta,
                pégalo y guárdalo aquí; luego genera el MP3 con la voz que definas en tu SSML.
              </p>
            </div>
          </div>
        </div>

        @if (error) {
          <div class="col-12">
            <div class="alert alert-danger d-flex justify-content-between align-items-center mb-0">
              <span>{{ error }}</span>
              <button class="btn-close" (click)="error = ''"></button>
            </div>
          </div>
        }

        @if (selectedTechId !== null) {
          @if (loading) {
            <div class="col-12"><div class="card"><div class="card-body text-muted text-center py-3">Cargando sesiones…</div></div></div>
          } @else if (sessions.length === 0) {
            <div class="col-12"><div class="card"><div class="card-body text-muted text-center py-3">
              Esta tecnología no tiene secciones de teoría todavía. Agrégalas en el Catálogo.
            </div></div></div>
          } @else {
            @for (s of sessions; track s.theorySectionId) {
              <div class="col-12">
                <div class="card">
                  <div class="card-body">
                    <!-- Header -->
                    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-primary rounded-pill" style="min-width:2rem">#{{ s.sessionNumber }}</span>
                        <h5 class="mb-0">{{ s.sectionTitle }}</h5>
                        @if (s.hasAudio) {
                          <span class="badge bg-success">MP3 listo</span>
                        } @else if (s.ssml) {
                          <span class="badge bg-secondary">SSML guardado</span>
                        }
                      </div>
                      <span class="text-muted small">{{ s.questionCount }} pregunta(s)</span>
                    </div>

                    <!-- Questions text (copyable material) -->
                    <button class="btn btn-sm btn-outline-secondary mb-2" (click)="toggleQuestions(s.theorySectionId)">
                      <iconify-icon [attr.icon]="expandedQuestions.has(s.theorySectionId) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                      Preguntas de la sesión
                    </button>
                    @if (expandedQuestions.has(s.theorySectionId)) {
                      <div class="mb-3">
                        <div class="d-flex justify-content-end mb-1">
                          <button class="btn btn-link btn-sm p-0" (click)="copyQuestions(s.theorySectionId)">
                            <iconify-icon icon="tabler:copy" width="14"></iconify-icon>
                            {{ copiedSection === s.theorySectionId ? '¡Copiado!' : 'Copiar' }}
                          </button>
                        </div>
                        <textarea class="form-control form-control-sm" rows="6" readonly
                          style="font-family: var(--bs-font-monospace); font-size:.8rem">{{ questionsText(s.theorySectionId) }}</textarea>
                      </div>
                    }

                    <!-- SSML editor -->
                    <label class="form-label small fw-semibold mb-1">SSML de esta sesión</label>
                    <textarea class="form-control" rows="6"
                      style="font-family: var(--bs-font-monospace); font-size:.8rem"
                      placeholder="Pega aquí tu SSML (<speak>…</speak>)…"
                      [ngModel]="ssmlEdits.get(s.theorySectionId) ?? ''"
                      (ngModelChange)="ssmlEdits.set(s.theorySectionId, $event)"></textarea>

                    <div class="d-flex flex-wrap gap-2 mt-2">
                      <button class="btn btn-sm btn-primary" (click)="saveSsml(s)" [disabled]="saving.has(s.theorySectionId)">
                        @if (saving.has(s.theorySectionId)) { <span class="spinner-border spinner-border-sm me-1"></span> }
                        Guardar SSML
                      </button>

                      @if (generating.has(s.theorySectionId)) {
                        <button class="btn btn-sm btn-success" disabled>
                          <span class="spinner-border spinner-border-sm me-1"></span> Generando MP3…
                        </button>
                      } @else {
                        <button class="btn btn-sm btn-success" (click)="generate(s)"
                          [disabled]="!s.ssml || isDirty(s)"
                          [title]="isDirty(s) ? 'Guarda el SSML antes de generar' : ''">
                          <iconify-icon [attr.icon]="s.hasAudio ? 'tabler:refresh' : 'tabler:microphone'" width="15"></iconify-icon>
                          {{ s.hasAudio ? 'Regenerar MP3' : 'Generar MP3' }}
                        </button>
                      }

                      @if (s.hasAudio) {
                        <button class="btn btn-sm btn-outline-primary" (click)="download(s)">
                          <iconify-icon icon="tabler:download" width="15"></iconify-icon> Descargar
                        </button>
                        <button class="btn btn-sm btn-outline-danger" (click)="deleteAudio(s)">
                          <iconify-icon icon="tabler:trash" width="15"></iconify-icon>
                        </button>
                      }
                    </div>

                    @if (isDirty(s)) {
                      <div class="text-warning small mt-1">Cambios sin guardar — guarda el SSML antes de generar.</div>
                    }

                    @if (s.hasAudio) {
                      <div class="mt-2">
                        @if (s.generatedAt) { <div class="text-muted small mb-1">Generado: {{ s.generatedAt | date:'short' }}</div> }
                        @if (audioUrls.get(s.theorySectionId)) {
                          <audio controls class="w-100" [src]="audioUrls.get(s.theorySectionId)"></audio>
                        } @else {
                          <button class="btn btn-link btn-sm p-0" (click)="loadAudio(s)" [disabled]="loadingAudio.has(s.theorySectionId)">
                            @if (loadingAudio.has(s.theorySectionId)) { Cargando… } @else { ▶ Reproducir }
                          </button>
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          }
        }
      </div>
    </div>
  `,
})
export class TechnologyAudio implements OnInit, OnDestroy {
  technologies: Technology[] = []
  selectedTechId: number | null = null
  sessions: StudyAudioSession[] = []
  loading = false
  error = ''

  questionsBySection = new Map<number, TechnologyTheoryQuestion[]>()
  ssmlEdits = new Map<number, string>()
  expandedQuestions = new Set<number>()
  copiedSection: number | null = null

  saving = new Set<number>()
  generating = new Set<number>()
  loadingAudio = new Set<number>()
  audioUrls = new Map<number, string>()

  constructor(private techSvc: TechnologyService, private svc: StudyAudioService) {}

  ngOnInit() {
    this.techSvc.getAll().subscribe(techs => {
      this.technologies = techs
      if (techs.length > 0) {
        this.selectedTechId = techs[0].id
        this.loadAll()
      }
    })
  }

  ngOnDestroy() {
    this.revokeAll()
  }

  onTechChange() {
    this.revokeAll()
    this.sessions = []
    this.questionsBySection.clear()
    this.ssmlEdits.clear()
    this.expandedQuestions.clear()
    this.loadAll()
  }

  private loadAll() {
    if (this.selectedTechId === null) return
    const techId = this.selectedTechId
    this.loading = true

    // Theory questions (grouped by section) provide the copyable material per session.
    this.techSvc.getTheoryQuestions(techId).subscribe(qs => {
      this.questionsBySection.clear()
      for (const q of qs) {
        const list = this.questionsBySection.get(q.sectionId) ?? []
        list.push(q)
        this.questionsBySection.set(q.sectionId, list)
      }
      for (const [, list] of this.questionsBySection) list.sort((a, b) => a.order - b.order)
    })

    this.svc.list(techId).subscribe({
      next: s => {
        this.sessions = s
        for (const sess of s) this.ssmlEdits.set(sess.theorySectionId, sess.ssml)
        this.loading = false
      },
      error: () => { this.error = 'No se pudieron cargar las sesiones.'; this.loading = false },
    })
  }

  toggleQuestions(sectionId: number) {
    if (this.expandedQuestions.has(sectionId)) this.expandedQuestions.delete(sectionId)
    else this.expandedQuestions.add(sectionId)
  }

  questionsText(sectionId: number): string {
    const list = this.questionsBySection.get(sectionId) ?? []
    if (list.length === 0) return '(Esta sesión no tiene preguntas de teoría.)'
    return list.map((q, i) => {
      const answer = (q.notes ?? '').trim() || '(sin respuesta registrada)'
      return `${i + 1}. ${q.question.trim()}\n   R: ${answer}`
    }).join('\n\n')
  }

  copyQuestions(sectionId: number) {
    navigator.clipboard?.writeText(this.questionsText(sectionId)).then(() => {
      this.copiedSection = sectionId
      setTimeout(() => { if (this.copiedSection === sectionId) this.copiedSection = null }, 1500)
    })
  }

  isDirty(s: StudyAudioSession): boolean {
    return (this.ssmlEdits.get(s.theorySectionId) ?? '') !== (s.ssml ?? '')
  }

  saveSsml(s: StudyAudioSession) {
    if (this.selectedTechId === null) return
    this.error = ''
    const ssml = this.ssmlEdits.get(s.theorySectionId) ?? ''
    this.saving.add(s.theorySectionId)
    this.svc.saveSsml(this.selectedTechId, s.theorySectionId, ssml).subscribe({
      next: () => { this.saving.delete(s.theorySectionId); this.loadSessions() },
      error: () => { this.saving.delete(s.theorySectionId); this.error = 'No se pudo guardar el SSML.' },
    })
  }

  generate(s: StudyAudioSession) {
    if (this.selectedTechId === null) return
    this.error = ''
    this.generating.add(s.theorySectionId)
    this.revoke(s.theorySectionId)
    this.svc.generate(this.selectedTechId, s.theorySectionId).subscribe({
      next: () => { this.generating.delete(s.theorySectionId); this.loadSessions() },
      error: err => {
        this.generating.delete(s.theorySectionId)
        this.error = err?.error?.detail || err?.error?.message || 'Falló la generación del audio.'
      },
    })
  }

  loadAudio(s: StudyAudioSession) {
    if (this.selectedTechId === null) return
    const id = s.theorySectionId
    this.loadingAudio.add(id)
    this.svc.getFile(this.selectedTechId, id).subscribe({
      next: blob => { this.audioUrls.set(id, URL.createObjectURL(blob)); this.loadingAudio.delete(id) },
      error: () => { this.loadingAudio.delete(id); this.error = 'No se pudo cargar el audio.' },
    })
  }

  download(s: StudyAudioSession) {
    if (this.selectedTechId === null) return
    const name = `${this.selectedTechName()} ${s.sectionTitle} ${s.sessionNumber}`.trim()
    this.svc.getFile(this.selectedTechId, s.theorySectionId).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${name}.mp3`
        a.click()
        URL.revokeObjectURL(url)
      },
      error: () => { this.error = 'No se pudo descargar el audio.' },
    })
  }

  deleteAudio(s: StudyAudioSession) {
    if (this.selectedTechId === null) return
    if (!confirm(`¿Eliminar el audio y el SSML de la sesión "${s.sectionTitle}"?`)) return
    this.revoke(s.theorySectionId)
    this.svc.delete(this.selectedTechId, s.theorySectionId).subscribe({
      next: () => this.loadSessions(),
      error: () => { this.error = 'No se pudo eliminar.' },
    })
  }

  private loadSessions() {
    if (this.selectedTechId === null) return
    this.svc.list(this.selectedTechId).subscribe({
      next: s => {
        this.sessions = s
        for (const sess of s) {
          // Keep the user's in-progress edit if it diverges; otherwise sync to saved value.
          if (!this.ssmlEdits.has(sess.theorySectionId)) this.ssmlEdits.set(sess.theorySectionId, sess.ssml)
        }
      },
      error: () => { this.error = 'No se pudieron cargar las sesiones.' },
    })
  }

  private selectedTechName(): string {
    return this.technologies.find(t => t.id === this.selectedTechId)?.name ?? ''
  }

  private revoke(sectionId: number) {
    const url = this.audioUrls.get(sectionId)
    if (url) { URL.revokeObjectURL(url); this.audioUrls.delete(sectionId) }
  }

  private revokeAll() {
    for (const url of this.audioUrls.values()) URL.revokeObjectURL(url)
    this.audioUrls.clear()
  }
}
