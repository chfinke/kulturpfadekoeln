import { Injectable } from '@angular/core';

import * as L from 'leaflet';
import { throwError } from 'rxjs';

import { Point } from '../core/data.service';

@Injectable()
export class MapService {
  public map;
  private bounds;
  private center;
  private highlight;

  constructor() { }

  swapCoordinates(coordinates: L.LatLng): L.LatLng {
    return new L.LatLng(coordinates[1], coordinates[0]);
  }

  setMap(map): void {
    this.map = map;
  }

  setBounds(bounds): void {
    this.map.flyToBounds(bounds);
  }

  freezeBounds(): void {
    this.bounds = this.map.getBounds();
  }

  restoreBounds(): void {
    this.map.flyToBounds(this.bounds);
  }

  setCenter(center: L.LatLng): void {
    if (!this.map?.getZoom()) {
    } else {
      this.map.panTo(center, {duration: 1});
    }
  }

  nextCenter(center): void {
    this.center = center;
  }

  freezeCenter(): void {
    try {
      this.center = this.map.getCenter();
    } catch {}
  }

  restoreCenter(): void {
    if (this.center) {
      if (!this.map.getZoom()) {
      } else {
        this.map.panTo(this.center);
      }
      this.center = null;
    }
  }
  // @TODO [introduce pending state and set center afterwards](https://www.notion.so/introduce-pending-state-and-set-center-afterwards-e8d73e87b60e46919d9c2cd9ef475f21)
  // might happen that even this is skipped as no zoom is set yet. 

  setHighlight(point: Point): void {
    this.clearHighlight();
    this.highlight = L.circleMarker(this.swapCoordinates(point.mapPosition.value), {
      radius: 8,
      color: 'black',
      fill: false,
      weight: 3,
      opacity: 1,
    }).addTo(this.map);
  }

  clearHighlight(): void {
    if (this.highlight) {
      const highlight = this.highlight;
      this.highlight = null;
      this.map.removeLayer(highlight);
    }
  }
}
