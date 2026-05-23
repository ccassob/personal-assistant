import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RefundsTable } from './refunds-table'

describe('RefundsTable', () => {
  let component: RefundsTable
  let fixture: ComponentFixture<RefundsTable>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundsTable],
    }).compileComponents()

    fixture = TestBed.createComponent(RefundsTable)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
