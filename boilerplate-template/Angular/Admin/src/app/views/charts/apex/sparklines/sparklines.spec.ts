import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Sparklines } from './sparklines'

describe('Sparklines', () => {
  let component: Sparklines
  let fixture: ComponentFixture<Sparklines>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sparklines],
    }).compileComponents()

    fixture = TestBed.createComponent(Sparklines)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
