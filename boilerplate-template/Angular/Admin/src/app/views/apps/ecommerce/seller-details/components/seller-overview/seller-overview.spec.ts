import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SellerOverview } from './seller-overview'

describe('SellerOverview', () => {
  let component: SellerOverview
  let fixture: ComponentFixture<SellerOverview>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerOverview],
    }).compileComponents()

    fixture = TestBed.createComponent(SellerOverview)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
