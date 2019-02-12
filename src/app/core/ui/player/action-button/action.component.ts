import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'a[sp-player-action]',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent implements OnInit {

  @Input()
  @HostBinding('class.active')
  active = false;

  @Input()
  @HostBinding('class.disabled')
  disabled = false;

  constructor() { }

  ngOnInit() {
  }

}
