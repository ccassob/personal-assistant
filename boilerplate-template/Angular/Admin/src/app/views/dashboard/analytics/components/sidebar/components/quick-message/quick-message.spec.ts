import { ComponentFixture, TestBed } from '@angular/core/testing'
import { QuickMessage } from './quick-message'

describe('QuickMessage', () => {
  let component: QuickMessage
  let fixture: ComponentFixture<QuickMessage>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickMessage],
    }).compileComponents()

    fixture = TestBed.createComponent(QuickMessage)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
