import { Component, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import {ResizeObserver} from 'resize-observer';

import * as L from 'leaflet';

import * as LGPX from 'leaflet-gpx';
import 'leaflet.locatecontrol';

import { MapService } from '../map.service';
import { DataService, PointBuildingsState, PointMapPositionState, Data } from '../../core/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  // providers: [{ provide: MapService }]
})
export class MapComponent implements AfterViewInit {
  @Input() id: string;
  @Input() trackId: string;
  @Input() pointId: string;
  @Input() static: boolean;
  @Input() classes: string;
  @Output() detail: EventEmitter<string> = new EventEmitter();

  constructor(private mapService: MapService, private dataService: DataService) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.initData();
  }

  initMap(): void {
    let mapId = 'map';
    if (this.id) {
      mapId = 'map' + this.id;
    } else {
    }
    const map = L.map(
      mapId,
      {
        zoomSnap: 0.1,
        zoomControl: !this.static
      }
    );

    map.attributionControl.setPrefix('&copy; <a href="https://leafletjs.com/" target="_blank">Leaflet</a>, <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> & <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> Beitragende');

    const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      // attribution: see above
    }).addTo(map);
    // when changing this also adapt it in src/ngsw-config.json

    if (this.static) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if (map.tap) {
        map.tap.disable();
      }
      // document.getElementById('map').style.cursor='default';
    }

    this.mapService.setMap(map);

    if (!this.static) {
      const locateControl = L.control
        .locate({
          position: 'topleft',
          drawCircle: true,
          flyTo: true,
          keepCurrentZoomLevel: true,
          markerStyle: {
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.8,
          },
          circleStyle: {
            weight: 1,
            // clickable: false
          },
          icon: 'fa fa-location-arrow',
          // metric: true,
          strings: {
            title: 'Meine Position',
            popup: 'Du bist innerhalb von {distance}&#8239;m um diesen Punkt',
            outsideMapBoundsMsg: 'Du befindest dich außerhalb der Karte',
          },
          locateOptions: {
            maxZoom: 18,
            watch: true,
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 10000,
          },
        })
        .addTo(map);

      const mapDiv = document.getElementById(mapId);
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
        this.mapService.restoreCenter();
      });
      resizeObserver.observe(mapDiv);
    }

    // L.easyButton('fa fa-search', () => {
    //   this.onSearch();
    // }).addTo(map);
  }

  async initData(): Promise<void> {
    const data: Data = await this.dataService.getData();

    const tracks = this.trackId ? [data.tracks[this.trackId]] : data.tracks;

    const markerList = [];
    Object.entries(tracks).forEach(([trackId, track]) => {
      new LGPX.GPX(
        `./assets/data/kulturpfadekoeln_${track.boroughNo}-${track.trackNo}.gpx`, {
        async: true,
        gpx_options: {
          parseElements: ['track'],
        },
        marker_options: {
          startIconUrl: '',
          endIconUrl: '',
          shadowUrl: ''
        },
        polyline_options: {
          color: track.color,
          opacity: 0.5,
          weight: 3,
          lineCap: 'round',
          interactive: false
        }
      }).addTo(this.mapService.map);

      Object.entries(track.points).forEach(([pointId, point]) => {
        if (point.mapPosition.state !== PointMapPositionState.Ok && point.mapPosition.state !== PointMapPositionState.Unknown) {
          if (environment.production === false) {
            console.log('mapPosition not displayed:', pointId, point.mapPosition.state, point.mapPosition.value);
          }
        } else {
          if (point.mapPosition.value) {
            const marker = L.circleMarker(this.mapService.swapCoordinates(point.mapPosition.value), {
              radius: 8,
              fillColor: point.trackPoint === 0 ? '#fff' : track.color,
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            });
            marker.on('click', () => {
              this.onDetail(pointId);
            });
            markerList.push(marker);
            marker.addTo(this.mapService.map);
          }
        }

        /* buildings disabled
        if (point.buildings.state !== PointBuildingsState.Ok) {
          if (environment.production === false) {
            console.warn('mapBuildings not displayed:', pointId, point.buildings.state, point.buildings.value);
          }
        } else {
          if (point.buildings.value) {
            const buildingsData = {
              type: ('Feature' as GeoJSON.GeoJsonTypes),
              properties: {
                color: track.color
              },
              geometry: {
                type: 'MultiPolygon',
                coordinates: [point.buildings.value]
              }
            };
            const buildings = L.geoJSON(buildingsData, {
              style: (feature) => ({
                color: feature.properties.color,
                weight: 3,
                opacity: 1,
                fill: true,
                fillColor: feature.properties.color
              }),
            });
            buildings.on('click', () => {
              this.onDetail(pointId);
            });
            buildings.addTo(this.mapService.map);
          }
        }
        */
      });
    });
    // @TODO change z-index of buildings

    const group = L.featureGroup(markerList);
    const bounds = group.getBounds();
    if (this.pointId) {
      const point = (await this.dataService.getPoint(this.pointId)).point;
      this.mapService.map.setView(this.mapService.swapCoordinates(point.mapPosition.value), 15);
      this.mapService.setHighlight(point);
    } else if (markerList.length === 1) {
      this.mapService.map.setView(bounds.getNorthWest(), 15);
    } else {
      this.mapService.map.fitBounds(
        bounds,
        {
          paddingTopLeft: [38, 5],
          paddingBottomRight: [5, 20],
        },
      );
    }
  }

  onDetail(id: string): void {
    this.detail.emit(id);
  }
}
