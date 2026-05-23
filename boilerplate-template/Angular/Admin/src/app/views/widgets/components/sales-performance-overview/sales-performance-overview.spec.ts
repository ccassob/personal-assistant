import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SalesPerformanceOverview } from './sales-performance-overview'

describe('SalesPerformanceOverview', () => {
  let component: SalesPerformanceOverview
  let fixture: ComponentFixture<SalesPerformanceOverview>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesPerformanceOverview],
    }).compileComponents()

    fixture = TestBed.createComponent(SalesPerformanceOverview)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
