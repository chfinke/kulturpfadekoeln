import { Component } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { DataService, Track, Point } from '../../core/data.service';

@Component({
  selector: 'app-track-page',
  templateUrl: './track-page.component.html',
  styleUrls: ['./track-page.component.css']
})
export class TrackPageComponent {
  trackId: string;
  track: Track;
  startingPoint: Point;
  points: Point[];
  queryParams: Params;

  constructor(private dataService: DataService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
      this.trackId = params.track;
      this.dataService.getTrack(this.trackId).then((track) => {
        this.track = track;
        this.startingPoint = track.points[`${this.trackId}.0`];
        this.points = Object.values(track.points).filter((point) => point.trackPoint !== 0);
      });
    });
  }
}
