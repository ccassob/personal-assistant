import { ComponentFixture, TestBed } from '@angular/core/testing'
import { IntegrationExploreCard } from './integration-explore-card'

describe('IntegrationExploreCard', () => {
  let component: IntegrationExploreCard
  let fixture: ComponentFixture<IntegrationExploreCard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationExploreCard],
    }).compileComponents()

    fixture = TestBed.createComponent(IntegrationExploreCard)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
