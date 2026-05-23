import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ForumPostCard } from './forum-post-card'

describe('ForumPostCard', () => {
  let component: ForumPostCard
  let fixture: ComponentFixture<ForumPostCard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumPostCard],
    }).compileComponents()

    fixture = TestBed.createComponent(ForumPostCard)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
