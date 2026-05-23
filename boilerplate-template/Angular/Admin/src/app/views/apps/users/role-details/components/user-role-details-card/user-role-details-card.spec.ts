import { ComponentFixture, TestBed } from '@angular/core/testing'
import { UserRoleDetailsCard } from './user-role-details-card'

describe('UserRoleDetailsCard', () => {
  let component: UserRoleDetailsCard
  let fixture: ComponentFixture<UserRoleDetailsCard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoleDetailsCard],
    }).compileComponents()

    fixture = TestBed.createComponent(UserRoleDetailsCard)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
