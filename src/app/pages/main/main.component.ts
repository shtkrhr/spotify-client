import { Component, OnInit } from '@angular/core';
import { clearAccessToken } from '../../core/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'sp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logOut() {
    clearAccessToken();
    this.router.navigate(['/auth/login']);
  }

}
