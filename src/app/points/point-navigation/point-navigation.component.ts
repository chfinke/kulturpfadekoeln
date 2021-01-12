import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Params } from '@angular/router';

import { Point, Track } from '../../map/data.service';

@Component({
  selector: 'app-point-navigation',
  templateUrl: './point-navigation.component.html',
  styleUrls: ['./point-navigation.component.css']
})
export class PointNavigationComponent {
  @Input() track: Track;
  @Input() point: Point;
  @Input() mapQueryParams: Params;
  @Output() detail: EventEmitter<string> = new EventEmitter();

  constructor() { }

  onDetail(id: string): void {
    this.detail.emit(id);
  }
}
