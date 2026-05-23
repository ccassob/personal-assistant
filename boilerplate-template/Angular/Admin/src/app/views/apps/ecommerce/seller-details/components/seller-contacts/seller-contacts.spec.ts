import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SellerContacts } from './seller-contacts'

describe('SellerContacts', () => {
  let component: SellerContacts
  let fixture: ComponentFixture<SellerContacts>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerContacts],
    }).compileComponents()

    fixture = TestBed.createComponent(SellerContacts)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
