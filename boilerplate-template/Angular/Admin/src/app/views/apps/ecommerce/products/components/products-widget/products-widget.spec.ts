import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProductsWidget } from './products-widget'

describe('ProductsWidget', () => {
  let component: ProductsWidget
  let fixture: ComponentFixture<ProductsWidget>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsWidget],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductsWidget)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
