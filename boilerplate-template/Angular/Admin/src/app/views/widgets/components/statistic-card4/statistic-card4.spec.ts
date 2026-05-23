import { ComponentFixture, TestBed } from '@angular/core/testing'
import { StatisticCard4 } from './statistic-card4'

describe('StatisticCard4', () => {
  let component: StatisticCard4
  let fixture: ComponentFixture<StatisticCard4>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticCard4],
    }).compileComponents()

    fixture = TestBed.createComponent(StatisticCard4)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
