import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Outlook } from './outlook'

describe('Outlook', () => {
  let component: Outlook
  let fixture: ComponentFixture<Outlook>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Outlook],
    }).compileComponents()

    fixture = TestBed.createComponent(Outlook)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
