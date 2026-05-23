import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TeamSidebar } from './team-sidebar'

describe('TeamSidebar', () => {
  let component: TeamSidebar
  let fixture: ComponentFixture<TeamSidebar>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamSidebar],
    }).compileComponents()

    fixture = TestBed.createComponent(TeamSidebar)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
