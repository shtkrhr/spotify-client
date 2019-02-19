import {
  Component,
  ElementRef, HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { msToHHMMSS } from '../../../util/util';
import { WebPlaybackState } from '../../../player/player';
import { of, Subject } from 'rxjs';
import { repeat, takeUntil } from 'rxjs/operators';
import { PlayerService } from '../../../player/player.service';
import { animationFrame } from '../../../../../../node_modules/rxjs/internal/scheduler/animationFrame';

const UNKNOWN_TIME_STRING = '--:--';

@Component({
  selector: 'sp-player-seek-bar',
  templateUrl: './seek-bar.component.html',
  styleUrls: ['./seek-bar.component.scss'],
})
export class SeekBarComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  state?: WebPlaybackState;

  private lastRequestId?: number;

  private destroyEvent = new Subject<void>();

  @ViewChild('progress')
  private progress: ElementRef;

  @ViewChild('currentTime')
  private currentTime: ElementRef;

  get totalTimeString() {
    return this.state ?
      msToHHMMSS(this.state.duration) :
      UNKNOWN_TIME_STRING;
  }

  constructor(private playerSdk: PlayerService) {}

  ngOnInit() {
    this.startAnimation();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnDestroy() {
    if (this.lastRequestId) {
      cancelAnimationFrame(this.lastRequestId);
    }
    this.destroyEvent.next();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.state) {
      return;
    }
    const ratio = event.offsetX / (event.target as HTMLElement).clientWidth;
    this.playerSdk.seek(ratio * this.state.duration);
  }

  private startAnimation() {
    return of(0, animationFrame).pipe(repeat(), takeUntil(this.destroyEvent)).subscribe(() => {
      if (!this.state) {
        this.progress.nativeElement.style.transform = `scale(0, 1)`;
        this.currentTime.nativeElement.textContent = UNKNOWN_TIME_STRING;
        return;
      }

      const position = this.state.paused ? this.state.position : this.state.position + Date.now() - this.state.timestamp;
      const ratio = Math.min(position / this.state.duration, 1);
      this.currentTime.nativeElement.textContent = msToHHMMSS(position);
      this.progress.nativeElement.style.transform = `scale(${ratio}, 1)`;
    });
  }



}
