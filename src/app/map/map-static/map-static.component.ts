import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MapService } from '../map.service';

@Component({
  selector: 'app-map-static',
  templateUrl: './map-static.component.html',
  styleUrls: ['./map-static.component.css'],
  providers: [MapService]
})
export class MapStaticComponent {
  @Input() id: string;
  @Input() trackId: string;
  @Input() pointId: string;
  @Input() classes: string;
  @Output() detail: EventEmitter<string> = new EventEmitter();

  constructor() { }

}
