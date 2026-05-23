import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FeaturedVideo } from './featured-video'

describe('FeaturedVideo', () => {
  let component: FeaturedVideo
  let fixture: ComponentFixture<FeaturedVideo>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedVideo],
    }).compileComponents()

    fixture = TestBed.createComponent(FeaturedVideo)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
