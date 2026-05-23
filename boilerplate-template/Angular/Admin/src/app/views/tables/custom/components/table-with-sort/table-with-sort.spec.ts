import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TableWithSort } from './table-with-sort'

describe('TableWithSort', () => {
  let component: TableWithSort
  let fixture: ComponentFixture<TableWithSort>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWithSort],
    }).compileComponents()

    fixture = TestBed.createComponent(TableWithSort)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
