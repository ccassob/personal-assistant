import { ComponentFixture, TestBed } from '@angular/core/testing'
import { UserRoleDetailsTable } from './user-role-details-table'

describe('UserRoleDetailsTable', () => {
  let component: UserRoleDetailsTable
  let fixture: ComponentFixture<UserRoleDetailsTable>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoleDetailsTable],
    }).compileComponents()

    fixture = TestBed.createComponent(UserRoleDetailsTable)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
