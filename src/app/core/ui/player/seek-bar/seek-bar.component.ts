import {
  ChangeDetectorRef,
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
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerService } from '../../../player/player.service';

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

  get totalTimeString() {
    return this.state ?
      msToHHMMSS(this.state.duration) :
      '--:--';
  }

  get currentTimeString() {
    if (!this.state) {
      return '--:--';
    }
    const position = this.state.position + Date.now() - this.state.timestamp;
    return msToHHMMSS(position);
  }

  constructor(private playerSdk: PlayerService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    interval(1000).pipe(takeUntil(this.destroyEvent))
      .subscribe(_ => this.changeDetector.detectChanges());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.state) {
      const prev = changes.state.previousValue as WebPlaybackState;
      const current = changes.state.currentValue as WebPlaybackState;
      if (current && !current.paused && (!prev || prev.paused)) {
        this.lastRequestId = requestAnimationFrame(this.animateBar.bind(this));
      }
    }
  }

  ngOnDestroy() {
    if (this.lastRequestId) {
      cancelAnimationFrame(this.lastRequestId);
    }
    this.destroyEvent.next();
    this.destroyEvent.complete();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.state) {
      return;
    }
    const ratio = event.offsetX / (event.target as HTMLElement).clientWidth;
    this.playerSdk.seek(ratio * this.state.duration);
  }

  private setBarProgress(state: WebPlaybackState) {
    const ratio = Math.min((state.position + Date.now() - state.timestamp) / state.duration, 1);
    this.progress.nativeElement.style.transform = `scale(${ratio}, 1)`;
  }

  private animateBar() {
    if (!this.state) {
      return;
    }

    this.setBarProgress(this.state);

    if (!this.state.paused) {
      this.lastRequestId = requestAnimationFrame(this.animateBar.bind(this));
    }
  }

}
