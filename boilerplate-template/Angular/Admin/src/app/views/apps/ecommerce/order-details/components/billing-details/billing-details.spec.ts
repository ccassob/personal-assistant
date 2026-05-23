import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BillingDetails } from './billing-details'

describe('BillingDetails', () => {
  let component: BillingDetails
  let fixture: ComponentFixture<BillingDetails>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingDetails],
    }).compileComponents()

    fixture = TestBed.createComponent(BillingDetails)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
