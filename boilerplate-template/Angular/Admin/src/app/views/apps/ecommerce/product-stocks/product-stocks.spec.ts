import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProductStocks } from './product-stocks'

describe('ProductStocks', () => {
  let component: ProductStocks
  let fixture: ComponentFixture<ProductStocks>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductStocks],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductStocks)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
