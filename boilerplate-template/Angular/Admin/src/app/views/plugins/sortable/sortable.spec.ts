import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Sortable } from './sortable'

describe('Sortable', () => {
  let component: Sortable
  let fixture: ComponentFixture<Sortable>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sortable],
    }).compileComponents()

    fixture = TestBed.createComponent(Sortable)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
