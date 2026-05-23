import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ParentInfo } from './parent-info'

describe('ParentInfo', () => {
  let component: ParentInfo
  let fixture: ComponentFixture<ParentInfo>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentInfo],
    }).compileComponents()

    fixture = TestBed.createComponent(ParentInfo)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
