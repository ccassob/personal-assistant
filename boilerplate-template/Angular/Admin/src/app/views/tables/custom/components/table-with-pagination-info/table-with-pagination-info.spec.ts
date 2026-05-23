import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TableWithPaginationInfo } from './table-with-pagination-info'

describe('TableWithPaginationInfo', () => {
  let component: TableWithPaginationInfo
  let fixture: ComponentFixture<TableWithPaginationInfo>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWithPaginationInfo],
    }).compileComponents()

    fixture = TestBed.createComponent(TableWithPaginationInfo)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
