import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core'
import JsVectorMap from 'jsvectormap'

@Component({
  selector: 'app-vector-map',
  imports: [],
  templateUrl: './vector-map.html',
  styles: ``,
})
export class VectorMap {
  @Input() width: string = ''
  @Input() height: string = ''
  @Input() options: Record<string, unknown> = {}
  @ViewChild('mapContainer', { static: true }) mapContainerRef!: ElementRef

  mapInstance!: InstanceType<typeof JsVectorMap>

  async ngAfterViewInit(): Promise<void> {
    if (this.options['map'] === 'world_merc') {
      await import('jsvectormap/dist/maps/world-merc.js')
    }
    if (this.options['map'] === 'world') {
      await import('jsvectormap/dist/maps/world.js')
    }
    if (this.options['map'] === 'us_aea_en') {
      await import('jsvectormap/dist/maps/us-aea-en.js')
    }
    if (this.options['map'] === 'canada') {
      await import('jsvectormap/dist/maps/canada.js')
    }
    if (this.options['map'] === 'russia') {
      await import('jsvectormap/dist/maps/russia.js')
    }
    if (this.options['map'] === 'iraq') {
      await import('jsvectormap/dist/maps/iraq.js')
    }
    if (this.options['map'] === 'spain') {
      await import('jsvectormap/dist/maps/spain.js')
    }

    setTimeout(() => {
      const container = this.mapContainerRef.nativeElement
      const width = container.offsetWidth
      const height = container.offsetHeight

      if (width && height) {
        this.mapInstance = new JsVectorMap({
          selector: container,
          ...this.options,
        })
      } else {
        console.warn('JsVectorMap: container has invalid dimensions.')
      }
    }, 100)
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.mapInstance?.updateSize()
  }

  ngOnDestroy(): void {
    this.mapInstance?.destroy()
  }
}
