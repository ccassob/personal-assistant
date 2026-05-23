import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ColumnSearching } from './column-searching'

describe('ColumnSearching', () => {
  let component: ColumnSearching
  let fixture: ComponentFixture<ColumnSearching>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnSearching],
    }).compileComponents()

    fixture = TestBed.createComponent(ColumnSearching)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
