import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarContent } from './sidebar-content'

describe('SidebarContent', () => {
  let component: SidebarContent
  let fixture: ComponentFixture<SidebarContent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarContent],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarContent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
