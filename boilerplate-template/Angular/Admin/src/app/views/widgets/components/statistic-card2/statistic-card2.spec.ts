import { ComponentFixture, TestBed } from '@angular/core/testing'
import { StatisticCard2 } from './statistic-card2'

describe('StatisticCard2', () => {
  let component: StatisticCard2
  let fixture: ComponentFixture<StatisticCard2>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticCard2],
    }).compileComponents()

    fixture = TestBed.createComponent(StatisticCard2)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
