import { getColor } from '@/app/utils/string'
import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { VectorMap } from '@app/components/vector-map/vector-map'

type Marker = {
  name: string
  coords: [number, number]
}

type MarkerStyle = {
  initial: { fill: string }
  selected: { fill: string }
}

type RegionStyle = {
  initial: {
    stroke: string
    strokeWidth: number
    fill: string
    fillOpacity: number
  }
}

type LabelRender = {
  markers: {
    render: (marker: Marker) => string
  }
}

export type WorldMapOptions = {
  map: string
  zoomOnScroll: boolean
  zoomButtons: boolean
  markersSelectable: boolean
  markers: Marker[]
  markerStyle: MarkerStyle
  regionStyle: RegionStyle
  labels: LabelRender
}

@Component({
  selector: 'app-vector',
  imports: [PageBreadcrumb, VectorMap],
  templateUrl: './vector.html',
  styles: ``,
})
export class Vector {
  getWorldMapOptions = (): WorldMapOptions => ({
    map: 'world',
    zoomOnScroll: false,
    zoomButtons: true,
    markersSelectable: true,
    markers: [
      { name: 'Greenland', coords: [72, -42] },
      { name: 'Canada', coords: [56.1304, -106.3468] },
      { name: 'Brazil', coords: [-14.235, -51.9253] },
      { name: 'Egypt', coords: [26.8206, 30.8025] },
      { name: 'Russia', coords: [61, 105] },
      { name: 'China', coords: [35.8617, 104.1954] },
      { name: 'United States', coords: [37.0902, -95.7129] },
      { name: 'Norway', coords: [60.472024, 8.468946] },
      { name: 'Ukraine', coords: [48.379433, 31.16558] },
    ],
    markerStyle: {
      initial: { fill: getColor('primary') },
      selected: { fill: getColor('primary') },
    },
    regionStyle: {
      initial: {
        stroke: '#aab9d14d',
        strokeWidth: 0.25,
        fill: '#aab9d14d',
        fillOpacity: 1,
      },
    },
    labels: {
      markers: {
        render: (marker: Marker) => marker.name,
      },
    },
  })

  getWorldMarkerLineOptions = () => ({
    map: 'world_merc',
    zoomOnScroll: false,
    zoomButtons: false,
    markers: [
      {
        name: 'Greenland',
        coords: [72, -42],
      },
      {
        name: 'Canada',
        coords: [56.1304, -106.3468],
      },
      {
        name: 'Brazil',
        coords: [-14.235, -51.9253],
      },
      {
        name: 'Egypt',
        coords: [26.8206, 30.8025],
      },
      {
        name: 'Russia',
        coords: [61, 105],
      },
      {
        name: 'China',
        coords: [35.8617, 104.1954],
      },
      {
        name: 'United States',
        coords: [37.0902, -95.7129],
      },
      {
        name: 'Norway',
        coords: [60.472024, 8.468946],
      },
      {
        name: 'Ukraine',
        coords: [48.379433, 31.16558],
      },
    ],
    lines: [
      {
        from: 'Canada',
        to: 'Egypt',
      },
      {
        from: 'Russia',
        to: 'Egypt',
      },
      {
        from: 'Greenland',
        to: 'Egypt',
      },
      {
        from: 'Brazil',
        to: 'Egypt',
      },
      {
        from: 'United States',
        to: 'Egypt',
      },
      {
        from: 'China',
        to: 'Egypt',
      },
      {
        from: 'Norway',
        to: 'Egypt',
      },
      {
        from: 'Ukraine',
        to: 'Egypt',
      },
    ],
    regionStyle: {
      initial: {
        stroke: '#aab9d14d',
        strokeWidth: 0.25,
        fill: '#aab9d14d',
        fillOpacity: 1,
      },
    },
    markerStyle: {
      initial: { fill: getColor('secondary') },
      selected: { fill: getColor('secondary') },
    },
    lineStyle: {
      animation: true,
      strokeDasharray: '6 3 6',
    },
  })

  getUSAMapOptions = () => ({
    map: 'us_aea_en',
    regionStyle: {
      initial: {
        fill: getColor('primary'),
      },
    },
  })

  getCanadaMapOptions = () => ({
    map: 'canada',
    zoomOnScroll: false,
    regionStyle: {
      initial: {
        fill: getColor('primary'),
      },
    },
  })

  getRussiaMapOptions = () => ({
    map: 'russia',
    zoomOnScroll: false,
    regionStyle: {
      initial: {
        fill: '#aab9d14d',
      },
    },
  })

  getIraqMapOptions = () => ({
    map: 'iraq',
    zoomOnScroll: false,
    regionStyle: {
      initial: {
        fill: getColor('primary'),
      },
    },
  })

  getSpainMapOptions = () => ({
    map: 'spain',
    zoomOnScroll: false,
    regionStyle: {
      initial: {
        fill: '#aab9d14d',
      },
    },
  })
}
