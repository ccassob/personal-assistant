import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink, RouterLinkActive } from '@angular/router'
import {
  Technology, TechnologyPracticeSection, TechnologyPracticeItem,
  TechnologyTheorySection, TechnologyTheoryQuestion, TechnologyService, ImportTopicsResult
} from '../../core/services/api/technology.service'

@Component({
  selector: 'app-technologies',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Tech Mastery</h4>
            <button class="btn btn-primary" (click)="openForm()">
              <iconify-icon icon="tabler:plus" width="16"></iconify-icon> Add Technology
            </button>
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
        @for (t of technologies; track t.id) {
          <div class="col-12">
            <div class="card" style="border-top: 4px solid {{ t.color }}">
              <div class="card-body">

                <!-- Header -->
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="d-flex align-items-center gap-2">
                    @if (t.icon) {
                      <iconify-icon [attr.icon]="t.icon" width="20" [style.color]="t.color"></iconify-icon>
                    }
                    <h5 class="card-title mb-0">{{ t.name }}</h5>
                  </div>
                  <span class="badge {{ levelBadgeClass(t.level) }}">{{ t.level }}</span>
                </div>

                @if (t.notes) {
                  <p class="text-muted small fst-italic mb-2">{{ t.notes }}</p>
                }

                <!-- Score -->
                <div class="progress mb-1" style="height: 10px">
                  <div class="progress-bar" role="progressbar" [style.width.%]="t.totalScore" [style.background]="t.color"></div>
                </div>
                <div class="d-flex justify-content-between text-muted small mb-3">
                  <span>{{ t.totalScore }}% dominado</span>
                  <span>Práctica: {{ t.practiceEarnedPoints }}/{{ t.practiceTotalPoints }} pts · Teoría: {{ t.theoryEarnedPoints }}/{{ t.theoryTotalPoints }} pts</span>
                </div>

                <!-- Practice section -->
                <button class="btn btn-sm btn-outline-success w-100 d-flex justify-content-between align-items-center mb-2"
                  (click)="togglePracticeSection(t)">
                  <span>
                    <iconify-icon icon="tabler:tool" width="14" class="me-1"></iconify-icon>
                    Práctica
                    <span class="badge bg-success ms-1" style="font-size:.7rem">{{ practiceDone(t.id) }}/{{ practiceCount(t.id) }}</span>
                  </span>
                  <iconify-icon [attr.icon]="expandedPractice.has(t.id) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                </button>
                @if (expandedPractice.has(t.id)) {
                  <div class="border rounded p-2 mb-2">
                    @if (!practiceSections.has(t.id)) {
                      <div class="text-muted small text-center py-1">Loading...</div>
                    } @else if ((practiceSections.get(t.id) ?? []).length === 0) {
                      <div class="text-muted small text-center py-1">Agrega una sección para empezar (ej. "1. Fundamentos").</div>
                    } @else {
                      @for (section of practiceSections.get(t.id) ?? []; track section.id) {
                        <div class="mb-3">
                          <div class="d-flex justify-content-between align-items-center rounded px-2 py-2 mb-2"
                            style="background: rgba(25,135,84,.15); border-left: 4px solid #198754">
                            <span class="fw-bold" style="font-size: 1.05rem">{{ section.title }}</span>
                            <div class="d-flex align-items-center gap-2">
                              <span class="badge bg-info text-dark">{{ sectionItemsDone(t.id, section.id) }}/{{ sectionItemCount(t.id, section.id) }} ítems</span>
                              <span class="badge bg-secondary">{{ sectionEarned(t.id, section.id) }}/{{ sectionTotal(t.id, section.id) }} pts</span>
                              <button class="btn btn-link btn-sm p-0 text-danger" (click)="deletePracticeSection(t, section)">Delete</button>
                            </div>
                          </div>
                          @for (item of practiceItemsFor(t.id, section.id); track item.id) {
                            @if (item.isDone) {
                              <div class="border-bottom py-1">
                                <div class="d-flex align-items-center gap-2">
                                  <iconify-icon icon="tabler:circle-check-filled" width="16" class="text-success flex-shrink-0"></iconify-icon>
                                  <span class="flex-grow-1 small text-decoration-line-through text-muted">
                                    {{ item.title }}
                                    @if (item.subcategory) { <span class="text-muted" style="font-size:.75rem">· {{ item.subcategory }}</span> }
                                  </span>
                                  <span class="badge bg-success">+{{ item.points }}</span>
                                  <button class="btn btn-link btn-sm p-0 text-muted" (click)="undoPracticeItem(t, item)">Deshacer</button>
                                  <button class="btn btn-link btn-sm p-0 text-danger" (click)="deletePracticeItem(t, item)">Delete</button>
                                </div>
                                @if (item.notes || item.completedAt) {
                                  <div class="text-muted small ps-4" style="font-size:.75rem">
                                    {{ item.completedAt }}@if (item.notes) { — {{ item.notes }} }
                                  </div>
                                }
                              </div>
                            } @else if (confirmingPractice.has(item.id)) {
                              <div class="border-bottom py-2">
                                <div class="small fw-semibold mb-1">{{ item.title }} <span class="badge bg-secondary">+{{ item.points }}</span></div>
                                <div class="d-flex gap-2">
                                  <input class="form-control form-control-sm" placeholder="¿Qué hiciste realmente?" [(ngModel)]="pendingPracticeNote[item.id]">
                                  <button class="btn btn-sm btn-success text-nowrap" (click)="confirmPracticeDone(t, item)">Guardar</button>
                                  <button class="btn btn-sm btn-outline-secondary text-nowrap" (click)="cancelPracticeConfirm(item)">Cancelar</button>
                                </div>
                              </div>
                            } @else {
                              <div class="d-flex align-items-center gap-2 py-1 border-bottom">
                                <span class="flex-grow-1 small">
                                  {{ item.title }}
                                  @if (item.subcategory) { <span class="text-muted" style="font-size:.75rem">· {{ item.subcategory }}</span> }
                                </span>
                                <span class="badge bg-secondary">+{{ item.points }}</span>
                                <button class="btn btn-sm btn-outline-success text-nowrap" (click)="startPracticeConfirm(item)">Marcar hecho</button>
                                <button class="btn btn-link btn-sm p-0 text-danger" (click)="deletePracticeItem(t, item)">Delete</button>
                              </div>
                            }
                          } @empty {
                            <div class="text-muted small py-1" style="font-size:.8rem">Sin ítems en esta sección todavía.</div>
                          }
                          <div class="d-flex gap-2 mt-1">
                            <input type="text" class="form-control form-control-sm" placeholder="Título (ej. Crear un Deployment)"
                              [(ngModel)]="newPracticeItemTitle[section.id]">
                            <input type="number" class="form-control form-control-sm" style="max-width: 90px" placeholder="Pts"
                              min="1" [(ngModel)]="newPracticeItemPoints[section.id]">
                            <button class="btn btn-sm btn-success text-nowrap" (click)="addPracticeItem(t, section)">Add</button>
                          </div>
                        </div>
                      }
                    }
                    <div class="d-flex gap-2 mt-2 border-top pt-2">
                      <input type="text" class="form-control form-control-sm" placeholder="Nueva sección (ej. 1. Fundamentos)"
                        [(ngModel)]="newPracticeSectionTitle[t.id]">
                      <button class="btn btn-sm btn-outline-success text-nowrap" (click)="addPracticeSection(t)">Add Section</button>
                    </div>
                  </div>
                }

                <!-- Theory section -->
                <button class="btn btn-sm btn-outline-primary w-100 d-flex justify-content-between align-items-center mb-2"
                  (click)="toggleTheorySection(t)">
                  <span>
                    <iconify-icon icon="tabler:brain" width="14" class="me-1"></iconify-icon>
                    Teoría
                    <span class="badge bg-primary ms-1" style="font-size:.7rem">{{ theoryMastered(t.id) }}/{{ theoryCount(t.id) }}</span>
                  </span>
                  <iconify-icon [attr.icon]="expandedTheory.has(t.id) ? 'tabler:chevron-up' : 'tabler:chevron-down'" width="14"></iconify-icon>
                </button>
                @if (expandedTheory.has(t.id)) {
                  <div class="border rounded p-2 mb-2">
                    @if (!theorySections.has(t.id)) {
                      <div class="text-muted small text-center py-1">Loading...</div>
                    } @else if ((theorySections.get(t.id) ?? []).length === 0) {
                      <div class="text-muted small text-center py-1">Agrega una sección para empezar (ej. "Fundamentos").</div>
                    } @else {
                      @for (section of theorySections.get(t.id) ?? []; track section.id) {
                        <div class="mb-3">
                          <div class="d-flex justify-content-between align-items-center rounded px-2 py-2 mb-2"
                            style="background: rgba(13,110,253,.12); border-left: 4px solid #0d6efd">
                            <span class="fw-bold" style="font-size: 1.05rem">{{ section.title }}</span>
                            <div class="d-flex align-items-center gap-2">
                              <span class="badge bg-info text-dark">{{ theorySectionMasteredCount(t.id, section.id) }}/{{ theorySectionQuestionCount(t.id, section.id) }} preguntas</span>
                              <span class="badge bg-secondary">{{ theorySectionMastered(t.id, section.id) }}/{{ theorySectionTotal(t.id, section.id) }} pts</span>
                              <button class="btn btn-link btn-sm p-0 text-danger" (click)="deleteTheorySection(t, section)">Delete</button>
                            </div>
                          </div>
                          @for (q of theoryQuestionsFor(t.id, section.id); track q.id) {
                            @if (q.isMastered) {
                              <div class="border-bottom py-1">
                                <div class="d-flex align-items-center gap-2">
                                  <iconify-icon icon="tabler:circle-check-filled" width="16" class="text-primary flex-shrink-0"></iconify-icon>
                                  <span class="flex-grow-1 small text-decoration-line-through text-muted">
                                    {{ q.question }}
                                    @if (q.subcategory) { <span class="text-muted" style="font-size:.75rem">· {{ q.subcategory }}</span> }
                                  </span>
                                  <span class="badge bg-primary">+{{ q.points }}</span>
                                  <button class="btn btn-link btn-sm p-0 text-muted" (click)="undoTheoryQuestion(t, q)">Deshacer</button>
                                  <button class="btn btn-link btn-sm p-0 text-danger" (click)="deleteTheoryQuestion(t, q)">Delete</button>
                                </div>
                                @if (q.notes || q.answeredAt) {
                                  <div class="text-muted small ps-4" style="font-size:.75rem">
                                    {{ q.answeredAt }}@if (q.notes) { — {{ q.notes }} }
                                  </div>
                                }
                              </div>
                            } @else if (confirmingTheory.has(q.id)) {
                              <div class="border-bottom py-2">
                                <div class="small fw-semibold mb-1">{{ q.question }} <span class="badge bg-secondary">+{{ q.points }}</span></div>
                                <div class="d-flex gap-2">
                                  <input class="form-control form-control-sm" placeholder="Nota opcional (tu respuesta)" [(ngModel)]="pendingTheoryNote[q.id]">
                                  <button class="btn btn-sm btn-primary text-nowrap" (click)="confirmTheoryMastered(t, q)">Guardar</button>
                                  <button class="btn btn-sm btn-outline-secondary text-nowrap" (click)="cancelTheoryConfirm(q)">Cancelar</button>
                                </div>
                              </div>
                            } @else {
                              <div class="d-flex align-items-center gap-2 py-1 border-bottom">
                                <span class="flex-grow-1 small">
                                  {{ q.question }}
                                  @if (q.subcategory) { <span class="text-muted" style="font-size:.75rem">· {{ q.subcategory }}</span> }
                                </span>
                                <span class="badge bg-secondary">+{{ q.points }}</span>
                                <button class="btn btn-sm btn-outline-primary text-nowrap" (click)="startTheoryConfirm(q)">¿Dominada?</button>
                                <button class="btn btn-link btn-sm p-0 text-danger" (click)="deleteTheoryQuestion(t, q)">Delete</button>
                              </div>
                            }
                          } @empty {
                            <div class="text-muted small py-1" style="font-size:.8rem">Sin preguntas en esta sección todavía.</div>
                          }
                          <div class="d-flex gap-2 mt-1">
                            <input type="text" class="form-control form-control-sm" placeholder="Pregunta (ej. ¿Qué es un Pod?)"
                              [(ngModel)]="newTheoryQuestionText[section.id]">
                            <input type="number" class="form-control form-control-sm" style="max-width: 90px" placeholder="Pts"
                              min="1" [(ngModel)]="newTheoryQuestionPoints[section.id]">
                            <button class="btn btn-sm btn-primary text-nowrap" (click)="addTheoryQuestion(t, section)">Add</button>
                          </div>
                        </div>
                      }
                    }
                    <div class="d-flex gap-2 mt-2 border-top pt-2">
                      <input type="text" class="form-control form-control-sm" placeholder="Nueva sección (ej. Fundamentos)"
                        [(ngModel)]="newTheorySectionTitle[t.id]">
                      <button class="btn btn-sm btn-outline-primary text-nowrap" (click)="addTheorySection(t)">Add Section</button>
                    </div>
                  </div>
                }

              </div>

              <div class="card-footer d-flex gap-2">
                <button class="btn btn-sm btn-outline-secondary flex-fill" (click)="openImportModal(t)">
                  <iconify-icon icon="tabler:file-import" width="14" class="me-1"></iconify-icon> Importar CSV
                </button>
                <button class="btn btn-sm btn-outline-primary flex-fill" (click)="openForm(t)">Edit</button>
                <button class="btn btn-sm btn-outline-danger flex-fill" (click)="delete(t.id)">Delete</button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12 text-center text-muted py-5">No technologies yet. Add one to start tracking your mastery!</div>
        }
      </div>
    </div>

    <!-- Technology modal -->
    @if (showModal) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ form.id ? 'Edit' : 'Add' }} Technology</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input class="form-control" [(ngModel)]="form.name" placeholder="e.g. Kubernetes">
              </div>
              <div class="mb-3">
                <label class="form-label">Color</label>
                <input type="color" class="form-control form-control-color" [(ngModel)]="form.color">
              </div>
              <div class="mb-3">
                <label class="form-label">Icon <small class="text-muted">(Iconify, e.g. tabler:brand-docker)</small></label>
                <input class="form-control" [(ngModel)]="form.icon" placeholder="tabler:brand-docker">
              </div>
              <div class="mb-3">
                <label class="form-label">Notes <span class="text-muted">(optional)</span></label>
                <textarea class="form-control" [(ngModel)]="form.notes" rows="2" placeholder="Any additional details..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeForm()">Cancel</button>
              <button class="btn btn-primary" (click)="save()">Save</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Import CSV modal -->
    @if (showImportModal && importTechnology) {
      <div class="modal show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Importar CSV — {{ importTechnology.name }}</h5>
              <button type="button" class="btn-close" (click)="closeImportModal()"></button>
            </div>
            <div class="modal-body">
              <p class="text-muted small">
                Formato: <code>Category,Subcategory,Name,Type,Points</code> (con o sin fila de encabezado).
                <code>Subcategory</code> es la sección (se crea o reutiliza por nombre); <code>Category</code> solo se guarda como dato informativo.
                <code>Type</code> debe ser <code>Practice</code> o <code>Theory</code>.
              </p>
              <div class="mb-3">
                <input type="file" class="form-control" accept=".csv,text/csv" (change)="onCsvFileSelected($event)">
              </div>
              @if (importFileName) {
                <div class="text-muted small mb-3">Archivo: {{ importFileName }}</div>
              }
              @if (importError) {
                <div class="alert alert-danger py-2 small">{{ importError }}</div>
              }
              @if (importResult) {
                <div class="alert alert-success py-2 small mb-2">
                  Importados: {{ importResult.imported }} · Saltados (duplicados): {{ importResult.skipped }}
                </div>
                @if (importResult.errors.length > 0) {
                  <div class="alert alert-warning py-2 small">
                    <div class="fw-semibold mb-1">Errores ({{ importResult.errors.length }}):</div>
                    <ul class="mb-0 ps-3">
                      @for (err of importResult.errors; track err) {
                        <li>{{ err }}</li>
                      }
                    </ul>
                  </div>
                }
              }
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeImportModal()">Cerrar</button>
              <button class="btn btn-primary" [disabled]="!pendingCsvContent || importing" (click)="confirmImport()">
                {{ importing ? 'Importando...' : 'Importar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class Technologies implements OnInit {
  technologies: Technology[] = []

  showModal = false
  form: Partial<Technology> = this.emptyForm()

  expandedPractice = new Set<number>()
  expandedTheory = new Set<number>()
  practiceSections = new Map<number, TechnologyPracticeSection[]>()
  practiceItems = new Map<number, TechnologyPracticeItem[]>()
  theorySections = new Map<number, TechnologyTheorySection[]>()
  theoryQuestions = new Map<number, TechnologyTheoryQuestion[]>()

  newPracticeSectionTitle: Record<number, string> = {}
  newPracticeItemTitle: Record<number, string> = {}
  newPracticeItemPoints: Record<number, number> = {}
  newTheorySectionTitle: Record<number, string> = {}
  newTheoryQuestionText: Record<number, string> = {}
  newTheoryQuestionPoints: Record<number, number> = {}

  confirmingPractice = new Set<number>()
  pendingPracticeNote: Record<number, string> = {}
  confirmingTheory = new Set<number>()
  pendingTheoryNote: Record<number, string> = {}

  showImportModal = false
  importTechnology: Technology | null = null
  importFileName = ''
  pendingCsvContent = ''
  importing = false
  importResult: ImportTopicsResult | null = null
  importError = ''

  constructor(private svc: TechnologyService) {}

  ngOnInit() { this.load() }

  load() {
    this.svc.getAll().subscribe(data => {
      this.technologies = data
      data.forEach(t => {
        this.svc.getPracticeItems(t.id).subscribe(items => this.practiceItems.set(t.id, items))
        this.svc.getTheoryQuestions(t.id).subscribe(qs => this.theoryQuestions.set(t.id, qs))
      })
    })
  }

  emptyForm(): Partial<Technology> {
    return { name: '', color: '#3b82f6', icon: '', notes: '' }
  }

  levelBadgeClass(level: string): string {
    switch (level) {
      case 'Básico': return 'bg-info text-dark'
      case 'Intermedio': return 'bg-primary'
      case 'Avanzado': return 'bg-warning text-dark'
      case 'Experto': return 'bg-success'
      case 'Dominio demostrado': return 'bg-dark'
      default: return 'bg-secondary' // Principiante
    }
  }

  // ---- Section toggles ----

  togglePracticeSection(t: Technology) {
    if (this.expandedPractice.has(t.id)) {
      this.expandedPractice.delete(t.id)
    } else {
      this.expandedPractice.add(t.id)
      if (!this.practiceSections.has(t.id)) this.reloadPracticeSections(t)
    }
  }

  toggleTheorySection(t: Technology) {
    if (this.expandedTheory.has(t.id)) {
      this.expandedTheory.delete(t.id)
    } else {
      this.expandedTheory.add(t.id)
      if (!this.theorySections.has(t.id)) this.reloadTheorySections(t)
    }
  }

  // ---- Stats / grouping helpers ----

  practiceCount(id: number): number { return (this.practiceItems.get(id) ?? []).length }
  practiceDone(id: number): number { return (this.practiceItems.get(id) ?? []).filter(p => p.isDone).length }
  theoryCount(id: number): number { return (this.theoryQuestions.get(id) ?? []).length }
  theoryMastered(id: number): number { return (this.theoryQuestions.get(id) ?? []).filter(q => q.isMastered).length }

  practiceItemsFor(techId: number, sectionId: number): TechnologyPracticeItem[] {
    return (this.practiceItems.get(techId) ?? []).filter(i => i.sectionId === sectionId)
  }
  sectionEarned(techId: number, sectionId: number): number {
    return this.practiceItemsFor(techId, sectionId).filter(i => i.isDone).reduce((s, i) => s + i.points, 0)
  }
  sectionTotal(techId: number, sectionId: number): number {
    return this.practiceItemsFor(techId, sectionId).reduce((s, i) => s + i.points, 0)
  }
  sectionItemCount(techId: number, sectionId: number): number {
    return this.practiceItemsFor(techId, sectionId).length
  }
  sectionItemsDone(techId: number, sectionId: number): number {
    return this.practiceItemsFor(techId, sectionId).filter(i => i.isDone).length
  }

  theoryQuestionsFor(techId: number, sectionId: number): TechnologyTheoryQuestion[] {
    return (this.theoryQuestions.get(techId) ?? []).filter(q => q.sectionId === sectionId)
  }
  theorySectionMastered(techId: number, sectionId: number): number {
    return this.theoryQuestionsFor(techId, sectionId).filter(q => q.isMastered).reduce((s, q) => s + q.points, 0)
  }
  theorySectionTotal(techId: number, sectionId: number): number {
    return this.theoryQuestionsFor(techId, sectionId).reduce((s, q) => s + q.points, 0)
  }
  theorySectionQuestionCount(techId: number, sectionId: number): number {
    return this.theoryQuestionsFor(techId, sectionId).length
  }
  theorySectionMasteredCount(techId: number, sectionId: number): number {
    return this.theoryQuestionsFor(techId, sectionId).filter(q => q.isMastered).length
  }

  // ---- Technology CRUD ----

  openForm(t?: Technology) {
    this.form = t ? { ...t } : this.emptyForm()
    this.showModal = true
  }

  closeForm() { this.showModal = false }

  save() {
    const payload = { name: this.form.name ?? '', color: this.form.color ?? '#3b82f6', icon: this.form.icon ?? '', notes: this.form.notes ?? '' }
    if (this.form.id) {
      this.svc.update({ id: this.form.id, ...payload }).subscribe(() => { this.load(); this.closeForm() })
    } else {
      this.svc.create(payload).subscribe(() => { this.load(); this.closeForm() })
    }
  }

  delete(id: number) {
    if (confirm('Delete this technology and all its practice/theory sections?')) {
      this.svc.delete(id).subscribe(() => this.load())
    }
  }

  // ---- CSV import ----

  openImportModal(t: Technology) {
    this.importTechnology = t
    this.importFileName = ''
    this.pendingCsvContent = ''
    this.importResult = null
    this.importError = ''
    this.showImportModal = true
  }

  closeImportModal() {
    this.showImportModal = false
    this.importTechnology = null
  }

  onCsvFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    this.importResult = null
    this.importError = ''
    if (!file) { this.pendingCsvContent = ''; this.importFileName = ''; return }

    this.importFileName = file.name
    const reader = new FileReader()
    reader.onload = () => { this.pendingCsvContent = (reader.result as string) ?? '' }
    reader.onerror = () => { this.importError = 'No se pudo leer el archivo.' }
    reader.readAsText(file)
  }

  confirmImport() {
    if (!this.importTechnology || !this.pendingCsvContent) return
    const t = this.importTechnology
    this.importing = true
    this.importError = ''
    this.svc.importCsv(t.id, this.pendingCsvContent).subscribe({
      next: (result) => {
        this.importing = false
        this.importResult = result
        this.reloadPracticeSections(t)
        this.reloadPractice(t)
        this.reloadTheorySections(t)
        this.reloadTheory(t)
      },
      error: () => {
        this.importing = false
        this.importError = 'Ocurrió un error al importar el archivo.'
      }
    })
  }

  // ---- Practice sections ----

  private reloadPracticeSections(t: Technology) {
    this.svc.getPracticeSections(t.id).subscribe(sections => this.practiceSections.set(t.id, sections))
  }

  private reloadPractice(t: Technology, refreshTechnologies = true) {
    this.svc.getPracticeItems(t.id).subscribe(items => this.practiceItems.set(t.id, items))
    if (refreshTechnologies) this.svc.getAll().subscribe(data => this.technologies = data)
  }

  addPracticeSection(t: Technology) {
    const title = (this.newPracticeSectionTitle[t.id] ?? '').trim()
    if (!title) return
    this.svc.createPracticeSection(t.id, title).subscribe(() => {
      this.newPracticeSectionTitle[t.id] = ''
      this.reloadPracticeSections(t)
    })
  }

  deletePracticeSection(t: Technology, section: TechnologyPracticeSection) {
    if (!confirm(`Delete section "${section.title}" and all its items?`)) return
    this.svc.deletePracticeSection(t.id, section.id).subscribe(() => {
      this.reloadPracticeSections(t)
      this.reloadPractice(t)
    })
  }

  // ---- Practice items ----

  addPracticeItem(t: Technology, section: TechnologyPracticeSection) {
    const title = (this.newPracticeItemTitle[section.id] ?? '').trim()
    const points = this.newPracticeItemPoints[section.id]
    if (!title || !points) return
    this.svc.createPracticeItem(t.id, section.id, title, points).subscribe(() => {
      this.newPracticeItemTitle[section.id] = ''
      this.newPracticeItemPoints[section.id] = 0
      this.reloadPractice(t)
    })
  }

  startPracticeConfirm(item: TechnologyPracticeItem) {
    this.confirmingPractice.add(item.id)
    this.pendingPracticeNote[item.id] = ''
  }

  cancelPracticeConfirm(item: TechnologyPracticeItem) {
    this.confirmingPractice.delete(item.id)
  }

  confirmPracticeDone(t: Technology, item: TechnologyPracticeItem) {
    this.svc.updatePracticeItem(t.id, item.id, true, this.pendingPracticeNote[item.id]).subscribe(() => {
      this.confirmingPractice.delete(item.id)
      this.reloadPractice(t)
    })
  }

  undoPracticeItem(t: Technology, item: TechnologyPracticeItem) {
    this.svc.updatePracticeItem(t.id, item.id, false).subscribe(() => this.reloadPractice(t))
  }

  deletePracticeItem(t: Technology, item: TechnologyPracticeItem) {
    this.svc.deletePracticeItem(t.id, item.id).subscribe(() => this.reloadPractice(t))
  }

  // ---- Theory sections ----

  private reloadTheorySections(t: Technology) {
    this.svc.getTheorySections(t.id).subscribe(sections => this.theorySections.set(t.id, sections))
  }

  private reloadTheory(t: Technology, refreshTechnologies = true) {
    this.svc.getTheoryQuestions(t.id).subscribe(qs => this.theoryQuestions.set(t.id, qs))
    if (refreshTechnologies) this.svc.getAll().subscribe(data => this.technologies = data)
  }

  addTheorySection(t: Technology) {
    const title = (this.newTheorySectionTitle[t.id] ?? '').trim()
    if (!title) return
    this.svc.createTheorySection(t.id, title).subscribe(() => {
      this.newTheorySectionTitle[t.id] = ''
      this.reloadTheorySections(t)
    })
  }

  deleteTheorySection(t: Technology, section: TechnologyTheorySection) {
    if (!confirm(`Delete section "${section.title}" and all its questions?`)) return
    this.svc.deleteTheorySection(t.id, section.id).subscribe(() => {
      this.reloadTheorySections(t)
      this.reloadTheory(t)
    })
  }

  // ---- Theory questions ----

  addTheoryQuestion(t: Technology, section: TechnologyTheorySection) {
    const question = (this.newTheoryQuestionText[section.id] ?? '').trim()
    const points = this.newTheoryQuestionPoints[section.id]
    if (!question || !points) return
    this.svc.createTheoryQuestion(t.id, section.id, question, points).subscribe(() => {
      this.newTheoryQuestionText[section.id] = ''
      this.newTheoryQuestionPoints[section.id] = 0
      this.reloadTheory(t)
    })
  }

  startTheoryConfirm(q: TechnologyTheoryQuestion) {
    this.confirmingTheory.add(q.id)
    this.pendingTheoryNote[q.id] = ''
  }

  cancelTheoryConfirm(q: TechnologyTheoryQuestion) {
    this.confirmingTheory.delete(q.id)
  }

  confirmTheoryMastered(t: Technology, q: TechnologyTheoryQuestion) {
    this.svc.updateTheoryQuestion(t.id, q.id, true, this.pendingTheoryNote[q.id]).subscribe(() => {
      this.confirmingTheory.delete(q.id)
      this.reloadTheory(t)
    })
  }

  undoTheoryQuestion(t: Technology, q: TechnologyTheoryQuestion) {
    this.svc.updateTheoryQuestion(t.id, q.id, false).subscribe(() => this.reloadTheory(t))
  }

  deleteTheoryQuestion(t: Technology, q: TechnologyTheoryQuestion) {
    this.svc.deleteTheoryQuestion(t.id, q.id).subscribe(() => this.reloadTheory(t))
  }
}
