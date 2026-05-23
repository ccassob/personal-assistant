import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectCard2 } from './project-card2'

describe('ProjectCard2', () => {
  let component: ProjectCard2
  let fixture: ComponentFixture<ProjectCard2>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCard2],
    }).compileComponents()

    fixture = TestBed.createComponent(ProjectCard2)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
