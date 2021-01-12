import { Component, Input } from '@angular/core';

import { Track, Point } from 'src/app/map/data.service';

@Component({
  selector: 'app-track-info',
  templateUrl: './track-info.component.html',
  styleUrls: ['./track-info.component.css']
})
export class TrackInfoComponent {
  @Input() track: Track;
  @Input() startingPoint: Point;

  constructor() { }

}
