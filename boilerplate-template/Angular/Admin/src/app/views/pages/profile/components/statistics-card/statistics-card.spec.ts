import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StatisticsCard } from './statistics-card'

describe('StatisticsCard', () => {
  let component: StatisticsCard
  let fixture: ComponentFixture<StatisticsCard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsCard],
    }).compileComponents()

    fixture = TestBed.createComponent(StatisticsCard)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
