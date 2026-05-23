import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StatisticWidgetChartRight } from './statistic-widget-chart-right'

describe('StatisticWidgetChartRight', () => {
  let component: StatisticWidgetChartRight
  let fixture: ComponentFixture<StatisticWidgetChartRight>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticWidgetChartRight],
    }).compileComponents()

    fixture = TestBed.createComponent(StatisticWidgetChartRight)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
