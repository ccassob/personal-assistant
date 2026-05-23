import { ComponentFixture, TestBed } from '@angular/core/testing'
import { StatisticCard5 } from './statistic-card5'

describe('StatisticCard5', () => {
  let component: StatisticCard5
  let fixture: ComponentFixture<StatisticCard5>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticCard5],
    }).compileComponents()

    fixture = TestBed.createComponent(StatisticCard5)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
