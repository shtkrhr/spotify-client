import { Component, OnInit } from '@angular/core';
import { authEndpoint } from '../../../core/auth/auth';

@Component({
  selector: 'sp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  authEndpoint = authEndpoint();

  ngOnInit() {
  }

}
