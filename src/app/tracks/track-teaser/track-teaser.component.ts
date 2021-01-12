import { Component, Input } from '@angular/core';

import { Track, Point } from 'src/app/map/data.service';

@Component({
  selector: 'app-track-teaser',
  templateUrl: './track-teaser.component.html',
  styleUrls: ['./track-teaser.component.css']
})
export class TrackTeaserComponent {
  @Input() track: Track;
  @Input() startingPoint: Point;

  constructor() { }

}
