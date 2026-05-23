import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SellerTable } from './seller-table'

describe('SellerTable', () => {
  let component: SellerTable
  let fixture: ComponentFixture<SellerTable>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerTable],
    }).compileComponents()

    fixture = TestBed.createComponent(SellerTable)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
