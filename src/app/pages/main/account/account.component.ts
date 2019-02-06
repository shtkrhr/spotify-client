import { Component, OnInit } from '@angular/core';
import { logOut } from '../../../core/auth/auth';

@Component({
  selector: 'sp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  logOut() {
    logOut();
  }

}
