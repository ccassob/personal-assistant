import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Advanced } from './advanced'

describe('Advanced', () => {
  let component: Advanced
  let fixture: ComponentFixture<Advanced>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Advanced],
    }).compileComponents()

    fixture = TestBed.createComponent(Advanced)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
