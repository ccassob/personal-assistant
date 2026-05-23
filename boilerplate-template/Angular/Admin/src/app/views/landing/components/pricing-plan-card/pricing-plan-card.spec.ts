import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PricingPlanCard } from './pricing-plan-card'

describe('PricingPlanCard', () => {
  let component: PricingPlanCard
  let fixture: ComponentFixture<PricingPlanCard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingPlanCard],
    }).compileComponents()

    fixture = TestBed.createComponent(PricingPlanCard)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
