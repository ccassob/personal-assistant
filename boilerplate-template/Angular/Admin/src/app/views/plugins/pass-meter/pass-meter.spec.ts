import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PassMeter } from './pass-meter'

describe('PassMeter', () => {
  let component: PassMeter
  let fixture: ComponentFixture<PassMeter>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassMeter],
    }).compileComponents()

    fixture = TestBed.createComponent(PassMeter)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
