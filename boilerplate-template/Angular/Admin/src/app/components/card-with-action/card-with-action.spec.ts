import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CardWithAction } from './card-with-action'

describe('CardWithAction', () => {
  let component: CardWithAction
  let fixture: ComponentFixture<CardWithAction>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWithAction],
    }).compileComponents()

    fixture = TestBed.createComponent(CardWithAction)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
