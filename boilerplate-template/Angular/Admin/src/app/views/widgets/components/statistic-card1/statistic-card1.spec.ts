import { ComponentFixture, TestBed } from '@angular/core/testing'
import { StatisticCard1 } from './statistic-card1'

describe('StatisticCard1', () => {
  let component: StatisticCard1
  let fixture: ComponentFixture<StatisticCard1>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticCard1],
    }).compileComponents()

    fixture = TestBed.createComponent(StatisticCard1)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
