import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { LeafletModule } from '@bluehalo/ngx-leaflet'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { circle, geoJSON, icon, latLng, layerGroup, LocationEvent, marker, polygon, tileLayer, type Icon, type Map, type MapOptions } from 'leaflet'
import { statesData } from './data'
const leafShadow = 'assets/images/leaflet/leaf-shadow.png'
const leafGreen = 'assets/images/leaflet/leaf-green.png'
const leafOrange = 'assets/images/leaflet/leaf-orange.png'
const leafRed = 'assets/images/leaflet/leaf-red.png'
const markerIcon = 'assets/images/leaflet/marker-icon.png'
const markerShadow = 'assets/images/leaflet/marker-shadow.png'

@Component({
  selector: 'app-leaflet',
  imports: [PageBreadcrumb, LeafletModule],
  templateUrl: './leaflet.html',
  styles: ``,
})
export class Leaflet {
  leafIcons: Record<string, string> = {
    green: leafGreen,
    orange: leafOrange,
    red: leafRed,
  }

  iconConfig(color: string): Icon {
    return icon({
      iconUrl: this.leafIcons[color],
      shadowUrl: leafShadow,
      iconSize: [38, 95],
      shadowSize: [50, 64],
      iconAnchor: [22, 94],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76],
    })
  }
  getColor(d: number): string {
    return d > 1000 ? '#800026' : d > 500 ? '#BD0026' : d > 200 ? '#E31A1C' : d > 100 ? '#FC4E2A' : d > 50 ? '#FD8D3C' : d > 20 ? '#FEB24C' : d > 10 ? '#FED976' : '#FFEDA0'
  }

  customIcon = icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  })

  cities = layerGroup([
    marker([39.61, -105.02], { icon: this.customIcon }).bindPopup('This is Littleton, CO.'),
    marker([39.74, -104.99], { icon: this.customIcon }).bindPopup('This is Denver, CO.'),
    marker([39.73, -104.8], { icon: this.customIcon }).bindPopup('This is Aurora, CO.'),
    marker([39.77, -105.23], { icon: this.customIcon }).bindPopup('This is Golden, CO.'),
  ])

  basicMapOptions: MapOptions = {
    layers: [tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18 })],
    center: latLng(42.35, -71.08),
    zoom: 10,
  }

  shapeMapOptions: MapOptions = {
    center: latLng(51.5, -0.09),
    zoom: 12,
    layers: [
      tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18 }),

      marker([51.5, -0.09], {
        icon: icon({
          iconUrl: markerIcon,
          shadowUrl: markerShadow,
        }),
      }),

      circle([51.508, -0.11], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500,
      }),

      polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]),
    ],
  }

  dragMapOptions: MapOptions = {
    center: latLng(48.817152, 2.455),
    zoom: 12,
    layers: [
      tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18 }),
      marker([48.817152, 2.455], {
        draggable: true,
        icon: icon({
          iconUrl: markerIcon,
          shadowUrl: markerShadow,
        }),
      })
        .bindPopup("<b>You're here!</b>")
        .openPopup(),
    ],
  }

  useLocationMapOptions: MapOptions = {
    center: latLng(42.35, -71.08),
    zoom: 10,
    layers: [tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18 })],
  }

  customIconMapOptions: MapOptions = {
    center: latLng(51.5, -0.09),
    zoom: 10,
    layers: [
      tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18 }),

      marker([51.5, -0.09], { icon: this.iconConfig('red') }),
      marker([51.4, -0.51], { icon: this.iconConfig('green') }),
      marker([51.49, -0.45], { icon: this.iconConfig('orange') }),
    ],
  }

  layerMapOptions: MapOptions = {
    center: latLng(39.73, -104.99),
    zoom: 10,
    layers: [tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18 }), this.cities],
  }

  geoMapOptions: MapOptions = {
    center: latLng(44.2669, -72.576),
    zoom: 3,
    layers: [
      tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18 }),

      geoJSON([statesData as FeatureCollection<Geometry, { density: number }>], {
        style: (feature?: Feature<Geometry, { density: number }>) => ({
          fillColor: this.getColor(feature?.properties?.density ?? 0),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7,
        }),
      }),
    ],
  }

  layersControlOptions = {
    baseLayers: {
      Street: tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18 }),
    },
    overlays: {
      Cities: this.cities,
    },
  }

  onMapReady(map: Map): void {
    map.locate({ setView: true, maxZoom: 16 })
    map.on('locationfound', (e: LocationEvent) => {
      const userMarker = marker(e.latlng).bindPopup(`You are somewhere around ${Math.round(e.accuracy)} meters from this point`)
      const userCircle = circle(e.latlng, { radius: e.accuracy })

      userMarker.addTo(map).openPopup()
      userCircle.addTo(map)
    })
  }
}
