import { ComponentFixture, TestBed } from '@angular/core/testing'
import { IntegrationCards } from './integration-cards'

describe('IntegrationCards', () => {
  let component: IntegrationCards
  let fixture: ComponentFixture<IntegrationCards>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationCards],
    }).compileComponents()

    fixture = TestBed.createComponent(IntegrationCards)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
