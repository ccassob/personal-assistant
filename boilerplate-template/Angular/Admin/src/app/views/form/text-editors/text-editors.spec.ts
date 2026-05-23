import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TextEditors } from './text-editors'

describe('TextEditors', () => {
  let component: TextEditors
  let fixture: ComponentFixture<TextEditors>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextEditors],
    }).compileComponents()

    fixture = TestBed.createComponent(TextEditors)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
