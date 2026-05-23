import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PinBoard } from './pin-board'

describe('PinBoard', () => {
  let component: PinBoard
  let fixture: ComponentFixture<PinBoard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinBoard],
    }).compileComponents()

    fixture = TestBed.createComponent(PinBoard)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
