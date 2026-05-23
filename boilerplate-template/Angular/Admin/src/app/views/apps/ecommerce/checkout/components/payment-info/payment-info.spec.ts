import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PaymentInfo } from './payment-info'

describe('PaymentInfo', () => {
  let component: PaymentInfo
  let fixture: ComponentFixture<PaymentInfo>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentInfo],
    }).compileComponents()

    fixture = TestBed.createComponent(PaymentInfo)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
