import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Tour } from './tour'

describe('Tour', () => {
  let component: Tour
  let fixture: ComponentFixture<Tour>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tour],
    }).compileComponents()

    fixture = TestBed.createComponent(Tour)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
