import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RelationResolvedData } from './relation.resolver';
import { Artist } from '../../../../../core/api/responses/artist';

@Component({
  selector: 'sp-artist-show-relation',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.scss'],
})
export class RelationComponent implements OnInit {

  data?: RelationResolvedData;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe(data => this.data = data.data);
  }

  onArtistClick(artist: Artist) {
    this.router.navigate(['/artist', artist.id]);
  }
}
