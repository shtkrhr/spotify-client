import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'sp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  authEndpoint: string;

  constructor(auth: AuthService) {
    this.authEndpoint = auth.authEndpoint();
  }

  ngOnInit() {
  }

}
