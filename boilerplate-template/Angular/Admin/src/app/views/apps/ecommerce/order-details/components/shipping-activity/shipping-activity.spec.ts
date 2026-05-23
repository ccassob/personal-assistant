import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ShippingActivity } from './shipping-activity'

describe('ShippingActivity', () => {
  let component: ShippingActivity
  let fixture: ComponentFixture<ShippingActivity>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingActivity],
    }).compileComponents()

    fixture = TestBed.createComponent(ShippingActivity)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
