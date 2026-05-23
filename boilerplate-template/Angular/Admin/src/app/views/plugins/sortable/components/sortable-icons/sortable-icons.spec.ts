import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SortableIcons } from './sortable-icons'

describe('SortableIcons', () => {
  let component: SortableIcons
  let fixture: ComponentFixture<SortableIcons>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortableIcons],
    }).compileComponents()

    fixture = TestBed.createComponent(SortableIcons)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
