import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProductViews } from './product-views'

describe('ProductViews', () => {
  let component: ProductViews
  let fixture: ComponentFixture<ProductViews>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductViews],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductViews)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
