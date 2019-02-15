import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { getAccessToken, onLogOut } from '../../core/auth/auth';
import { Router } from '@angular/router';
import { UserService } from '../../core/api/user.service';
import { PlayerService } from '../../core/player/player.service';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  readonly user$ = this.userApi.me();

  constructor(private router: Router,
              private userApi: UserService,
              private playerSdk: PlayerService,
              private ngZone: NgZone,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    onLogOut().subscribe(_ => {
      this.router.navigate(['/auth/login']);
      this.playerSdk.disconnect();
    });

    this.playerSdk.sdkReady$().subscribe(_ => {
      this.playerSdk.connect('sample', getAccessToken).subscribe();
    });

    merge<[string, any]>(...[
      this.playerSdk.sdkReady$().pipe(map<any, [string, any]>(r => ['sdkReady', r])),
      this.playerSdk.ready$().pipe(map<any, [string, any]>(r => ['ready', r])),
      this.playerSdk.notReady$().pipe(map<any, [string, any]>(r => ['notReady', r])),
      this.playerSdk.playerStateChanged$().pipe(map<any, [string, any]>(r => ['playerStateChanged', r])),
      this.playerSdk.initializationError$().pipe(map<any, [string, any]>(r => ['initializationError', r])),
      this.playerSdk.authenticationError$().pipe(map<any, [string, any]>(r => ['authenticationError', r])),
      this.playerSdk.accountError$().pipe(map<any, [string, any]>(r => ['accountError', r])),
      this.playerSdk.playbackError$().pipe(map<any, [string, any]>(r => ['playbackError', r])),
    ]).subscribe(([name, res]) => {
      console.log(name, res);
      setTimeout(() => this.changeDetector.detectChanges(), 0);
    });
  }

  nav(route: string[]) {
    this.ngZone.run(() => this.router.navigate(route)).then();
  }

}
