import { Component, Input } from '@angular/core';
import { OptionsService } from 'src/app/core/options.service';

import { Point } from '../../core/data.service';

@Component({
  selector: 'app-point-teaser',
  templateUrl: './point-teaser.component.html',
  styleUrls: ['./point-teaser.component.css']
})
export class PointTeaserComponent {
  @Input() point: Point;
  @Input() trackId: string;

  constructor(public optionsService: OptionsService) {}

}
