import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectUpdates } from './project-updates'

describe('ProjectUpdates', () => {
  let component: ProjectUpdates
  let fixture: ComponentFixture<ProjectUpdates>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectUpdates],
    }).compileComponents()

    fixture = TestBed.createComponent(ProjectUpdates)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
