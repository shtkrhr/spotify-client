import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, ReplaySubject } from 'rxjs';
import { ShowResolvedData } from './show.resolver';
import { ArtistService } from '../../../../core/api/artist.service';
import { map } from 'rxjs/operators';
import { Artist } from '../../../../core/api/responses/artist';
import { ArtistRelationDataSet } from '../../../../core/ui/artist-relation-graph/artist-relation-graph.component';

@Component({
  selector: 'sp-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {

  readonly data$ = new ReplaySubject<ShowResolvedData>(1);

  readonly relationDataSet$ = new ReplaySubject<ArtistRelationDataSet>(1);

  constructor(private route: ActivatedRoute, private artistApi: ArtistService, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.data$.next(data.data);
    });

    this.data$.subscribe(data => {
      const artist = data.artist;
      const relateds = data.relateds;
      const relations$ = combineLatest(relateds.map(relArtist => {
        return this.artistApi.relatedArtists(relArtist.id).pipe(map(relRelArtists => {
          return relRelArtists
            .filter(relRelArtist => relateds.some(_relArtist => _relArtist.id === relRelArtist.id))
            .map(relRelArtist => [relArtist.id, relRelArtist.id].sort());
        }));
      })).pipe(map((relationsList: [string, string][][]) => {
        const result = [] as [string, string][];
        relationsList.forEach((_relations: [string, string][]) => {
          _relations
            .filter(rel => result.every(_rel => rel.toString() !== _rel.toString()))
            .forEach(rel => result.push(rel as any));
        });
        return result;
      }));

      relations$.subscribe(relations => {
        this.relationDataSet$.next({artist, relateds, relations});
      });
    });
  }

  onArtistClick(artist: Artist) {
    this.router.navigate(['/artist', artist.id]);
  }

}
