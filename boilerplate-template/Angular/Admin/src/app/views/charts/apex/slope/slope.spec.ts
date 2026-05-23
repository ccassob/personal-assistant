import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Slope } from './slope'

describe('Slope', () => {
  let component: Slope
  let fixture: ComponentFixture<Slope>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Slope],
    }).compileComponents()

    fixture = TestBed.createComponent(Slope)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
