import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectProgressChart } from './project-progress-chart'

describe('ProjectProgressChart', () => {
  let component: ProjectProgressChart
  let fixture: ComponentFixture<ProjectProgressChart>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectProgressChart],
    }).compileComponents()

    fixture = TestBed.createComponent(ProjectProgressChart)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
