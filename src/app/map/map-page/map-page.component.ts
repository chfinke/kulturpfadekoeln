import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component } from '@angular/core';

import { DataService, Point, Track } from '../../core/data.service';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css'],
  providers: [{ provide: MapService }]
})
export class MapPageComponent {
  filteredTrackId: string;
  filteredTrack: Track;
  detailPoint: Point;
  detailTrack: Track;
  queryParams: Params;

  constructor(private dataService: DataService, private mapService: MapService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
      this.filteredTrackId = params.track;
      this.dataService.getTrack(this.filteredTrackId).then((track) => {
        this.filteredTrack = track;
      });
    });
    this.route.fragment
      .subscribe((fragment: string) => {
        const mapInfoContentElement = document.getElementById('map-info-content');
        if (mapInfoContentElement) {
          mapInfoContentElement.scroll(0, 0);
        }
        if (fragment) {
          this.setPoint(fragment);
        } else {
          this.unsetPoint();
        }
      });
  }

  setPoint(pointId: string): void {
    // @TODO [add animation when info changes](https://www.notion.so/add-animation-when-info-changes-40ef1ec09f5e40d18b4923a9ed4271da)
    this.dataService.getPoint(pointId).then((data) => {
      this.detailTrack = data.track;
      this.detailPoint = data.point;
      setTimeout(() => { // workaround when centering from different route
        this.mapService.setHighlight(data.point);
      }, 10);
      this.mapService.setCenter(this.mapService.swapCoordinates(data.point.mapPosition.value));
      this.mapService.nextCenter(this.mapService.swapCoordinates(data.point.mapPosition.value));
    });
  }

  unsetPoint(): void {
    this.detailTrack = null;
    this.detailPoint = null;
    this.mapService.clearHighlight();
    this.mapService.restoreCenter();
  }

  onDetail(id: string): void {
    this.router.navigate(['map'], { queryParams: this.queryParams, fragment: id });
  }

  onClose(): void {
    this.mapService.freezeCenter();
    this.router.navigate(['map'], { queryParams: this.queryParams, fragment: '' });
  }
}
