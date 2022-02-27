import { Component } from '@angular/core';

import { DataService, TrackWithPoints } from '../../core/data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  tracks: TrackWithPoints[];

  constructor(private dataService: DataService) {
    this.dataService.getTracks().then((tracks) => {
      this.tracks = Object.values(tracks).filter(track => !track.inactive);
    });
  }

}
