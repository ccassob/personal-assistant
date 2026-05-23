import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SortableList } from './sortable-list'

describe('SortableList', () => {
  let component: SortableList
  let fixture: ComponentFixture<SortableList>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortableList],
    }).compileComponents()

    fixture = TestBed.createComponent(SortableList)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
