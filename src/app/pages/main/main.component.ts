import { Component, NgZone, OnInit } from '@angular/core';
import { onLogOut } from '../../core/auth/auth';
import { Router } from '@angular/router';
import { UserService } from '../../core/api/user.service';

@Component({
  selector: 'sp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  readonly user$ = this.userApi.me();

  constructor(private router: Router,
              private userApi: UserService,
              private ngZone: NgZone) { }

  ngOnInit() {
    onLogOut().subscribe(_ => this.router.navigate(['/auth/login']));
  }

  nav(route: string[]) {
    this.ngZone.run(() => this.router.navigate(route)).then();
  }

}
