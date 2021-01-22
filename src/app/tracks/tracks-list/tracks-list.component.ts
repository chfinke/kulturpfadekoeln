import { Component, Input } from '@angular/core';

import { TrackWithPoints } from '../../core/data.service';

@Component({
  selector: 'app-tracks-list',
  templateUrl: './tracks-list.component.html',
  styleUrls: ['./tracks-list.component.css']
})
export class TracksListComponent {
  @Input() tracks: TrackWithPoints[];

  constructor() { }

}
