import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SortableListHandle } from './sortable-list-handle'

describe('SortableListHandle', () => {
  let component: SortableListHandle
  let fixture: ComponentFixture<SortableListHandle>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortableListHandle],
    }).compileComponents()

    fixture = TestBed.createComponent(SortableListHandle)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
