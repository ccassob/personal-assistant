import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PieChartWithMap } from './pie-chart-with-map'

describe('PieChartWithMap', () => {
  let component: PieChartWithMap
  let fixture: ComponentFixture<PieChartWithMap>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartWithMap],
    }).compileComponents()

    fixture = TestBed.createComponent(PieChartWithMap)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
