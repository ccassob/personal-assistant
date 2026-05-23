import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CurrencyTax } from './currency-tax'

describe('CurrencyTax', () => {
  let component: CurrencyTax
  let fixture: ComponentFixture<CurrencyTax>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyTax],
    }).compileComponents()

    fixture = TestBed.createComponent(CurrencyTax)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
