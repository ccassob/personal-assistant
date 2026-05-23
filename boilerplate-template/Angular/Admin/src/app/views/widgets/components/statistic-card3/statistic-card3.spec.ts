import { ComponentFixture, TestBed } from '@angular/core/testing'
import { StatisticCard3 } from './statistic-card3'

describe('StatisticCard3', () => {
  let component: StatisticCard3
  let fixture: ComponentFixture<StatisticCard3>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticCard3],
    }).compileComponents()

    fixture = TestBed.createComponent(StatisticCard3)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
