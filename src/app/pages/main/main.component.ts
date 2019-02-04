import { Component, OnInit } from '@angular/core';
import { clearAccessToken } from '../../core/auth/auth';
import { Router } from '@angular/router';
import { UserService } from '../../core/api/user.service';
import { ReplaySubject } from 'rxjs';
import { User } from '../../core/api/responses/user';

@Component({
  selector: 'sp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  readonly user$ = new ReplaySubject<User>();

  constructor(private router: Router, private userApi: UserService) { }

  ngOnInit() {
    this.userApi.me().subscribe(user => this.user$.next(user));
  }

  logOut() {
    clearAccessToken();
    this.router.navigate(['/auth/login']);
  }

}
