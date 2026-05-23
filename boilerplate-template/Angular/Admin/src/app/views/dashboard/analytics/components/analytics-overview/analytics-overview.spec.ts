import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AnalyticsOverview } from './analytics-overview'

describe('AnalyticsOverview', () => {
  let component: AnalyticsOverview
  let fixture: ComponentFixture<AnalyticsOverview>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsOverview],
    }).compileComponents()

    fixture = TestBed.createComponent(AnalyticsOverview)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
