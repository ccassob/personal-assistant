import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TableWithDeleteButton } from './table-with-delete-button'

describe('TableWithDeleteButton', () => {
  let component: TableWithDeleteButton
  let fixture: ComponentFixture<TableWithDeleteButton>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWithDeleteButton],
    }).compileComponents()

    fixture = TestBed.createComponent(TableWithDeleteButton)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
