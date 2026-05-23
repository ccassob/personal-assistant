import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ChildRows } from './child-rows'

describe('ChildRows', () => {
  let component: ChildRows
  let fixture: ComponentFixture<ChildRows>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildRows],
    }).compileComponents()

    fixture = TestBed.createComponent(ChildRows)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
