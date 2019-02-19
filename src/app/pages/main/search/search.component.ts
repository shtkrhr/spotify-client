import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchResolvedData } from './search.resolver';
import { isValidSearchParams } from '../../../core/api/method-params/search';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { SearchService } from './search.service';
import { isNullOrUndefined } from '../../../core/util/util';

@Component({
  selector: 'sp-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  @HostBinding('class.navigating')
  isNavigating = false;

  data?: SearchResolvedData;

  separatorKeysCodes = [ENTER, COMMA];

  genreCtrl = new FormControl();

  exceptedCtrl = new FormControl();

  filteredGenres$ = this.genreCtrl.valueChanges.pipe(
    startWith(null),
    map(g => g ? this.filterGenre(g) : this.data.genres.slice()));

  rangedYear = false;
  yearStart?: number;
  yearEnd?: number;
  year?: number;

  @ViewChild('genreInput')
  genreInput: ElementRef<HTMLInputElement>;

  @ViewChild('exceptedInput')
  exceptedInput: ElementRef<HTMLInputElement>;

  @ViewChild('auto')
  matAutocomplete: MatAutocomplete;

  get canSubmit() {
    return this.data &&
      isValidSearchParams(this.data.params) &&
      !(this.rangedYear && isNullOrUndefined(this.yearStart) !== isNullOrUndefined(this.yearEnd));
  }

  constructor(private route: ActivatedRoute, private router: Router, readonly page: SearchService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.data = data.data;
      this.rangedYear = this.data.params.year && this.data.params.year.start !== this.data.params.year.end;
      this.year = this.rangedYear ? undefined : (this.data.params.year && this.data.params.year.start);
      this.yearStart = this.rangedYear ? this.data.params.year.start : undefined;
      this.yearEnd = this.rangedYear ? this.data.params.year.end : undefined;
    });
  }

  onSubmit() {
    if (!this.canSubmit) {
      return;
    }
    this.isNavigating = true;
    this.router.navigate(['/search', this.page.pathType], {
      queryParams: {
        q: this.data.params.q,
        genres: this.data.params.genres || [],
        excepteds: this.data.params.excepteds || [],
        year_s: this.data.params.year && this.data.params.year.start,
        year_e: this.data.params.year && this.data.params.year.end,
        _: Date.now().toString(32),
      },
    }).then(_ => this.isNavigating = false);
  }

  addGenre(event: MatChipInputEvent) {
    if (this.matAutocomplete.isOpen) {
      return;
    }

    if ((event.value || '').trim()) {
      if (!this.data.params.genres) {
        this.data.params.genres = [];
      }
      this.data.params.genres.push(event.value.trim().toLowerCase());
    }

    if (event.input) {
      event.input.value = '';
    }

    this.genreCtrl.setValue(null);
  }

  addExcepted(event: MatChipInputEvent) {
    if ((event.value || '').trim()) {
      if (!this.data.params.excepteds) {
        this.data.params.excepteds = [];
      }
      this.data.params.excepteds.push(event.value.trim());
    }

    if (event.input) {
      event.input.value = '';
    }

    this.exceptedCtrl.setValue(null);
  }

  removeGenre(genre: string) {
    const index = this.data.params.genres.indexOf(genre);
    if (index > -1) {
      this.data.params.genres.splice(index, 1);
    }
  }

  removeExcepted(excepted: string) {
    const index = this.data.params.excepteds.indexOf(excepted);
    if (index > -1) {
      this.data.params.excepteds.splice(index, 1);
    }
  }

  onGenreSelected(event: MatAutocompleteSelectedEvent) {
    if (!this.data.params.genres) {
      this.data.params.genres = [];
    }
    this.data.params.genres.push(event.option.viewValue.toLowerCase());
    this.genreInput.nativeElement.value = '';
    this.genreCtrl.setValue(null);
  }

  updateYearParam() {
    if (this.rangedYear) {
      this.data.params.year = isNullOrUndefined(this.yearStart) || isNullOrUndefined(this.yearEnd) ?
        undefined : {start: this.yearStart, end: this.yearEnd};
    } else {
      this.data.params.year = isNullOrUndefined(this.year) ? undefined : {start: this.year, end: this.year};
    }
  }

  private filterGenre(genre: string): string[] {
    const filterValue = genre.toLowerCase();

    return this.data.genres.filter(g => g.toLowerCase().indexOf(filterValue) === 0);
  }
}
