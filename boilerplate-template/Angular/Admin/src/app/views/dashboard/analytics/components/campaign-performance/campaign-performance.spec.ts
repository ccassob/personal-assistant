import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CampaignPerformance } from './campaign-performance'

describe('CampaignPerformance', () => {
  let component: CampaignPerformance
  let fixture: ComponentFixture<CampaignPerformance>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignPerformance],
    }).compileComponents()

    fixture = TestBed.createComponent(CampaignPerformance)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
