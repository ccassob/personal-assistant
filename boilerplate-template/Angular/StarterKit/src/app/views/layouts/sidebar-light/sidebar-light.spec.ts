import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarLight } from './sidebar-light'

describe('SidebarLight', () => {
  let component: SidebarLight
  let fixture: ComponentFixture<SidebarLight>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarLight],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarLight)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
