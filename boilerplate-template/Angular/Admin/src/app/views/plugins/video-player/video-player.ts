import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import Plyr from 'plyr'

@Component({
  selector: 'app-video-player',
  imports: [PageBreadcrumb],
  templateUrl: './video-player.html',
  styles: ``,
})
export class VideoPlayer implements AfterViewInit {
  @ViewChild('player1') player1Ref!: ElementRef<HTMLVideoElement>
  @ViewChild('player2') player2Ref!: ElementRef<HTMLVideoElement>
  @ViewChild('yt1') yt1Ref!: ElementRef<HTMLDivElement>
  @ViewChild('vimeo1') vimeo1Ref!: ElementRef<HTMLDivElement>
  @ViewChild('audioPlayer') audioRef!: ElementRef<HTMLAudioElement>

  players: Plyr[] = []

  ngAfterViewInit(): void {
    // Initialize Plyr instances
    this.players.push(
      new Plyr(this.player1Ref.nativeElement, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'pip', 'fullscreen'],
      })
    )
    this.players.push(
      new Plyr(this.player2Ref.nativeElement, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'pip', 'fullscreen'],
      })
    )
    this.players.push(new Plyr(this.yt1Ref.nativeElement))
    this.players.push(new Plyr(this.vimeo1Ref.nativeElement))
    this.players.push(
      new Plyr(this.audioRef.nativeElement, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings'],
      })
    )
  }
}
