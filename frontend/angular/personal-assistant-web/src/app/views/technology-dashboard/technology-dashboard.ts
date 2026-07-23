import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { NgApexchartsModule } from 'ng-apexcharts'
import { ApexChart, ApexNonAxisChartSeries, ApexPlotOptions, ApexAxisChartSeries, ApexXAxis, ApexDataLabels } from 'ng-apexcharts'
import { Technology, TechnologyService } from '../../core/services/api/technology.service'

@Component({
  selector: 'app-technology-dashboard',
  imports: [RouterLink, RouterLinkActive, NgApexchartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="page-title">Tech Mastery Dashboard</h4>
          </div>
        </div>
      </div>

      <!-- Tech Mastery sub-nav -->
      <div class="row mb-1">
        <div class="col-12">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link" routerLink="/technologies" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Catálogo</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/technology-dashboard" routerLinkActive="active">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/technology-audio" routerLinkActive="active">Audios</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Summary cards -->
      <div class="row g-3 mb-3">
        <div class="col-sm-6 col-xl">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-muted mb-1">Tecnologías</p>
                  <h4 class="mb-0">{{ technologies.length }}</h4>
                </div>
                <div class="fs-3 opacity-50"><iconify-icon icon="tabler:stack-2" width="36"></iconify-icon></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-muted mb-1">Dominio Promedio</p>
                  <h4 class="mb-0">{{ avgScore }}%</h4>
                </div>
                <div class="fs-3 opacity-50"><iconify-icon icon="tabler:chart-arcs" width="36"></iconify-icon></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-muted mb-1">Experto o más</p>
                  <h4 class="text-success mb-0">{{ masteryCount }}</h4>
                </div>
                <div class="fs-3 text-success opacity-50"><iconify-icon icon="tabler:trophy" width="36"></iconify-icon></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-muted mb-1">Puntos de Práctica</p>
                  <h4 class="mb-0">{{ totalPracticeEarned }}/{{ totalPracticeTotal }}</h4>
                </div>
                <div class="fs-3 opacity-50"><iconify-icon icon="tabler:tool" width="36"></iconify-icon></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <p class="text-muted mb-1">Puntos de Teoría</p>
                  <h4 class="mb-0">{{ totalTheoryEarned }}/{{ totalTheoryTotal }}</h4>
                </div>
                <div class="fs-3 opacity-50"><iconify-icon icon="tabler:brain" width="36"></iconify-icon></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-xl-4">
          <div class="card h-100">
            <div class="card-header"><h5 class="card-title mb-0">Dominio Promedio</h5></div>
            <div class="card-body">
              @if (technologies.length > 0) {
                <apx-chart
                  [series]="overallRadialSeries"
                  [chart]="overallRadialChart"
                  [labels]="overallRadialLabels"
                  [plotOptions]="overallRadialPlotOptions">
                </apx-chart>
              } @else {
                <div class="text-center text-muted py-5">No hay tecnologías todavía.</div>
              }
            </div>
          </div>
        </div>
        <div class="col-xl-8">
          <div class="card h-100">
            <div class="card-header"><h5 class="card-title mb-0">Dominio por Tecnología</h5></div>
            <div class="card-body">
              @if (radialHasData) {
                <apx-chart
                  [series]="radialSeries"
                  [chart]="radialChart"
                  [labels]="radialLabels"
                  [plotOptions]="radialPlotOptions">
                </apx-chart>
              } @else {
                <div class="text-center text-muted py-5">No hay tecnologías todavía.</div>
              }
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-12">
          <div class="card">
            <div class="card-header"><h5 class="card-title mb-0">Ranking de Dominio</h5></div>
            <div class="card-body">
              @if (rankBarHasData) {
                <apx-chart
                  [series]="rankBarSeries"
                  [chart]="rankBarChart"
                  [xaxis]="rankBarXaxis"
                  [plotOptions]="rankBarPlotOptions"
                  [dataLabels]="rankBarDataLabels">
                </apx-chart>
              } @else {
                <div class="text-center text-muted py-5">No hay tecnologías todavía.</div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TechnologyDashboard implements OnInit {
  technologies: Technology[] = []
  avgScore = 0
  masteryCount = 0
  totalPracticeEarned = 0
  totalPracticeTotal = 0
  totalTheoryEarned = 0
  totalTheoryTotal = 0

  overallRadialSeries: ApexNonAxisChartSeries = []
  overallRadialLabels: string[] = ['Promedio']
  overallRadialChart: ApexChart = { type: 'radialBar', height: 300 }
  overallRadialPlotOptions: ApexPlotOptions = {
    radialBar: { dataLabels: { name: { show: true }, value: { formatter: (v: number) => `${v.toFixed(0)}%` } } }
  }

  radialSeries: ApexNonAxisChartSeries = []
  radialLabels: string[] = []
  radialHasData = false
  radialChart: ApexChart = { type: 'radialBar', height: 300 }
  radialPlotOptions: ApexPlotOptions = {
    radialBar: { dataLabels: { name: { show: true }, value: { formatter: (v: number) => `${v.toFixed(0)}%` } } }
  }

  rankBarSeries: ApexAxisChartSeries = []
  rankBarXaxis: ApexXAxis = { categories: [] }
  rankBarHasData = false
  rankBarChart: ApexChart = { type: 'bar', height: 300, toolbar: { show: false } }
  rankBarPlotOptions: ApexPlotOptions = { bar: { horizontal: true, barHeight: '60%' } }
  rankBarDataLabels: ApexDataLabels = { enabled: true, formatter: (val: number) => `${Number(val).toFixed(0)}%` }

  constructor(private svc: TechnologyService) {}

  ngOnInit() { this.load() }

  load() {
    this.svc.getAll().subscribe(data => {
      this.technologies = data
      this.avgScore = data.length ? Math.round(data.reduce((s, t) => s + t.totalScore, 0) / data.length) : 0
      this.masteryCount = data.filter(t => t.totalScore >= 81).length
      this.totalPracticeEarned = data.reduce((s, t) => s + t.practiceEarnedPoints, 0)
      this.totalPracticeTotal = data.reduce((s, t) => s + t.practiceTotalPoints, 0)
      this.totalTheoryEarned = data.reduce((s, t) => s + t.theoryEarnedPoints, 0)
      this.totalTheoryTotal = data.reduce((s, t) => s + t.theoryTotalPoints, 0)

      this.overallRadialSeries = [this.avgScore]
      this.buildRadial(data)
      this.buildRankBar(data)
    })
  }

  buildRadial(data: Technology[]) {
    this.radialHasData = data.length > 0
    this.radialLabels = data.map(t => t.name)
    this.radialSeries = data.map(t => t.totalScore)
  }

  buildRankBar(data: Technology[]) {
    const sorted = [...data].sort((a, b) => b.totalScore - a.totalScore)
    this.rankBarHasData = sorted.length > 0
    this.rankBarXaxis = { categories: sorted.map(t => t.name) }
    this.rankBarSeries = [{ name: 'Dominio', data: sorted.map(t => t.totalScore) }]
  }
}
