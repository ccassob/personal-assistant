import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StatisticWidgetChartLeft } from './statistic-widget-chart-left'

describe('StatisticWidgetChartLeft', () => {
  let component: StatisticWidgetChartLeft
  let fixture: ComponentFixture<StatisticWidgetChartLeft>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticWidgetChartLeft],
    }).compileComponents()

    fixture = TestBed.createComponent(StatisticWidgetChartLeft)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
