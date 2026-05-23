import { ComponentFixture, TestBed } from '@angular/core/testing'
import { StatisticCard6 } from './statistic-card6'

describe('StatisticCard6', () => {
  let component: StatisticCard6
  let fixture: ComponentFixture<StatisticCard6>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticCard6],
    }).compileComponents()

    fixture = TestBed.createComponent(StatisticCard6)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
