import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopbarDark } from './topbar-dark'

describe('TopbarDark', () => {
  let component: TopbarDark
  let fixture: ComponentFixture<TopbarDark>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarDark],
    }).compileComponents()

    fixture = TestBed.createComponent(TopbarDark)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
