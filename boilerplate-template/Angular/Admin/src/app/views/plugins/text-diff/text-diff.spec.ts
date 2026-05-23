import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TextDiff } from './text-diff'

describe('TextDiff', () => {
  let component: TextDiff
  let fixture: ComponentFixture<TextDiff>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextDiff],
    }).compileComponents()

    fixture = TestBed.createComponent(TextDiff)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
