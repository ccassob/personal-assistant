import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Pickers } from './pickers'

describe('Pickers', () => {
  let component: Pickers
  let fixture: ComponentFixture<Pickers>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pickers],
    }).compileComponents()

    fixture = TestBed.createComponent(Pickers)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
