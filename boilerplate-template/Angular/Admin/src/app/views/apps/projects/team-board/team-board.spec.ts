import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TeamBoard } from './team-board'

describe('TeamBoard', () => {
  let component: TeamBoard
  let fixture: ComponentFixture<TeamBoard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamBoard],
    }).compileComponents()

    fixture = TestBed.createComponent(TeamBoard)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
