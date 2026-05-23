import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OrdersCard } from './orders-card'

describe('OrdersCard', () => {
  let component: OrdersCard
  let fixture: ComponentFixture<OrdersCard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersCard],
    }).compileComponents()

    fixture = TestBed.createComponent(OrdersCard)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
