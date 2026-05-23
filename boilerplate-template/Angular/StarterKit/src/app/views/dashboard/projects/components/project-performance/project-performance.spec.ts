import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectPerformance } from './project-performance'

describe('ProjectPerformance', () => {
  let component: ProjectPerformance
  let fixture: ComponentFixture<ProjectPerformance>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectPerformance],
    }).compileComponents()

    fixture = TestBed.createComponent(ProjectPerformance)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
