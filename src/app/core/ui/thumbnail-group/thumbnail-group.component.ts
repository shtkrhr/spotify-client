import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subject, timer } from 'rxjs/index';
import { debounce, takeUntil } from 'rxjs/internal/operators';

const MAX_COLUMN_LENGTH = 24;

@Component({
  selector: 'sp-thumbnail-group',
  templateUrl: './thumbnail-group.component.html',
  styleUrls: ['./thumbnail-group.component.scss'],
})
export class ThumbnailGroupComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked, OnDestroy {

  @Input()
  column = 1;

  @Input()
  @HostBinding('attr.gutter')
  gutter: 'none' | 'thin' | 'narrow' | 'wide' | 'middle' = 'none';

  @Input()
  maxColumnWidth?: number;

  @HostBinding('attr.column')
  columnCount: number;

  private unsubscriber = new Subject<void>();

  private validMaxColumnWidth?: number;

  private lastHostWidth?: number;

  private widthResizeEvent = new Subject<void>();

  get gutterWidth() {
    switch (this.gutter) {
      case 'none':
        return 0;
      case 'thin':
        return 5;
      case 'narrow':
        return 15;
      case 'middle':
        return 30;
      case 'wide':
        return 50;
      default:
        return 0;
    }
  }

  constructor(private element: ElementRef, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.widthResizeEvent
      .pipe(
        debounce(_ => timer(50)),
        takeUntil(this.unsubscriber),
      )
      .subscribe(() => this.updateColumnIfCan());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.maxColumnWidth) {
      const maxColumnWidth = !!this.maxColumnWidth ? this.maxColumnWidth * 1 : NaN;
      this.validMaxColumnWidth = !isNaN(maxColumnWidth) && maxColumnWidth > 0 ? maxColumnWidth : undefined;
    }
    if (changes.column) {
      const column = parseInt(this.column + '', 10);
      if (isNaN(column) || column <= 0 || MAX_COLUMN_LENGTH < column) {
        throw new Error;
      }
      this.columnCount = column;
    }
    this.emitIfCan();
  }

  ngAfterViewInit() {
    this.updateColumnIfCan();
  }

  ngAfterViewChecked() {
    this.updateColumnIfCan();
  }

  ngOnDestroy() {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.lastHostWidth === this.element.nativeElement.clientWidth) {
      return;
    }
    this.lastHostWidth = this.element.nativeElement.clientWidth;
    this.emitIfCan();
  }

  private emitIfCan() {
    if (!this.validMaxColumnWidth) {
      return;
    }
    this.widthResizeEvent.next();
  }

  private updateColumnIfCan() {
    if (!this.validMaxColumnWidth) {
      return;
    }
    requestAnimationFrame(() => {
      const newCount = this.columnLength(this.gutterWidth, this.validMaxColumnWidth!, this.element.nativeElement.clientWidth);
      if (this.columnCount !== newCount) {
        this.columnCount = newCount;
        this.changeDetector.markForCheck();
      }
    });
  }

  private columnLength(gutterWidth: number, maxColumnWidth: number, hostWidth: number) {
    for (let column = 1; column <= MAX_COLUMN_LENGTH; column++) {
      const columnWidth = (hostWidth - (gutterWidth * (column - 1))) / column;
      if (columnWidth <= maxColumnWidth) {
        return column;
      }
    }
    return MAX_COLUMN_LENGTH;
  }
}
