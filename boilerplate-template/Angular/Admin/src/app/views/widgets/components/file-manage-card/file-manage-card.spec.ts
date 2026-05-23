import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FileManageCard } from './file-manage-card'

describe('FileManageCard', () => {
  let component: FileManageCard
  let fixture: ComponentFixture<FileManageCard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileManageCard],
    }).compileComponents()

    fixture = TestBed.createComponent(FileManageCard)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
