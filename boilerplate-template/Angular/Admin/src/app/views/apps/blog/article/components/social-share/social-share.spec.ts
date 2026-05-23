import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SocialShare } from './social-share'

describe('SocialShare', () => {
  let component: SocialShare
  let fixture: ComponentFixture<SocialShare>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialShare],
    }).compileComponents()

    fixture = TestBed.createComponent(SocialShare)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
