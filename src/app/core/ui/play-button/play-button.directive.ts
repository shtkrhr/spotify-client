import { Directive, HostListener, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { PlayerService as PlayerSdk } from '../../player/player.service';
import { PlayContext, PlayerService as PlayerApi } from '../../api/player.service';
import { TrackSimplified } from '../../api/responses/track';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[spPlayButton]',
})
export class PlayButtonDirective implements OnDestroy {

  @Input()
  context?: PlayContext;

  @Input()
  offset?: number | TrackSimplified;

  @Input()
  position?: number;

  private destroyEvent = new Subject<void>();

  constructor(private playerSdk: PlayerSdk, private playerApi: PlayerApi) {}

  ngOnDestroy() {
    this.destroyEvent.next();
    this.destroyEvent.complete();
  }

  @HostListener('click')
  onClick() {
    if (!this.context) {
      return;
    }
    this.playerApi.executePlay(this.context, () => this.playerSdk.deviceId, this.offset, this.position)
      .pipe(takeUntil(this.destroyEvent)).subscribe();
  }

}
