import { Component, OnInit } from '@angular/core';
import { logOut, onLogOut } from '../../core/auth/auth';
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

  readonly user$ = this.userApi.me();

  constructor(private router: Router, private userApi: UserService) { }

  ngOnInit() {
    onLogOut().subscribe(_ => this.router.navigate(['/auth/login']));
  }

  logOut() {
    logOut();
  }

}
