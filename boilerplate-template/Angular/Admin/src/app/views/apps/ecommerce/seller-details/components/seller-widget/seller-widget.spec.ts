import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SellerWidget } from './seller-widget'

describe('SellerWidget', () => {
  let component: SellerWidget
  let fixture: ComponentFixture<SellerWidget>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerWidget],
    }).compileComponents()

    fixture = TestBed.createComponent(SellerWidget)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
