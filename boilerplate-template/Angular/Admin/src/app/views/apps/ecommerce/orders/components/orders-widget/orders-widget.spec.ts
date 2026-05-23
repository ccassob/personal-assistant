import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OrdersWidget } from './orders-widget'

describe('OrdersWidget', () => {
  let component: OrdersWidget
  let fixture: ComponentFixture<OrdersWidget>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersWidget],
    }).compileComponents()

    fixture = TestBed.createComponent(OrdersWidget)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
