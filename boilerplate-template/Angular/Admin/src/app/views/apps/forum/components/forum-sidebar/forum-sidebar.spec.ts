import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ForumSidebar } from './forum-sidebar'

describe('ForumSidebar', () => {
  let component: ForumSidebar
  let fixture: ComponentFixture<ForumSidebar>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumSidebar],
    }).compileComponents()

    fixture = TestBed.createComponent(ForumSidebar)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
