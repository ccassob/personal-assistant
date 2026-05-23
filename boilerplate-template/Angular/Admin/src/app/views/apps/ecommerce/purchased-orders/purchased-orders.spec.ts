import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PurchasedOrders } from './purchased-orders'

describe('PurchasedOrders', () => {
  let component: PurchasedOrders
  let fixture: ComponentFixture<PurchasedOrders>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasedOrders],
    }).compileComponents()

    fixture = TestBed.createComponent(PurchasedOrders)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
