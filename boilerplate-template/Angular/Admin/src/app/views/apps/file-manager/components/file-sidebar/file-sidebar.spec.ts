import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FileSidebar } from './file-sidebar'

describe('FileSidebar', () => {
  let component: FileSidebar
  let fixture: ComponentFixture<FileSidebar>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileSidebar],
    }).compileComponents()

    fixture = TestBed.createComponent(FileSidebar)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
