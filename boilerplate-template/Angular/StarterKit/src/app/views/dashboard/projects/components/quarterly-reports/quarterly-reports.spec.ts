import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QuarterlyReports } from './quarterly-reports'

describe('QuarterlyReports', () => {
  let component: QuarterlyReports
  let fixture: ComponentFixture<QuarterlyReports>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuarterlyReports],
    }).compileComponents()

    fixture = TestBed.createComponent(QuarterlyReports)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
