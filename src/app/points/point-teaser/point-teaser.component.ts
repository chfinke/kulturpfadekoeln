import { Component, Input } from '@angular/core';

import { Point } from '../../core/data.service';

@Component({
  selector: 'app-point-teaser',
  templateUrl: './point-teaser.component.html',
  styleUrls: ['./point-teaser.component.css']
})
export class PointTeaserComponent {
  @Input() point: Point;
  @Input() trackId: string;

  constructor() { }

}
