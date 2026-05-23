import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TeamBoardCard } from './team-board-card'

describe('TeamBoardCard', () => {
  let component: TeamBoardCard
  let fixture: ComponentFixture<TeamBoardCard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamBoardCard],
    }).compileComponents()

    fixture = TestBed.createComponent(TeamBoardCard)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
