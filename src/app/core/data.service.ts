import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LatLng } from 'leaflet';

export interface Data {
  tracks: TracksWithPoints;
}

export interface Track {
  boroughNo: number;
  borough: string;
  trackNo: number;
  color: string;
  inactive?: boolean;
  incomplete?: boolean;
}

export interface TrackWithPoints extends Track {
  points: Points;
}

export type TracksWithPoints = { [key: string]: TrackWithPoints };

export enum PointDescriptionState {
  Unknown = '#unknown',
  Na = '#n/a',
  Check = '#check',
  Ok = '#ok'
}

export enum PointMapPositionState {
  Unknown = '#unknown',
  Check = '#check',
  Ok = '#ok'
}

export enum PointBuildingsState {
  Unknown = '#unknown',
  Na = '#n/a',
  Check = '#check',
  Ok = '#ok',
  Area = '#area'
}

export enum PointInfoState {
  Unknown = '#unknown',
  Na = '#n/a',
  Check = '#check',
  Ok = '#ok'
}

export enum PointWikiState {
  Unknown = '#unknown',
  Na = '#n/a',
  Check = '#check',
  Ok = '#ok'
}

export interface WikiItem {
  identifier: string;
  title: string;
}

export type WikiValue = string | WikiItem[];

export interface PointWiki{
  state: PointWikiState;
  value: WikiValue;
}

export enum PointMonumentNoState {
  Unknown = '#unknown',
  Na = '#n/a',
  Check = '#check',
  Ok = '#ok'
}

export interface MonumentNoItem {
  number: number;
  title: string;
}

export interface PointMonumentNo {
  state: PointMonumentNoState;
  value: MonumentNoValue;
}

export type MonumentNoValue = string | MonumentNoItem[];

export interface Point {
  trackPoint: number;
  trackSubpt: string;
  quarter: string;
  predecessor: string;
  successor: string;
  title: string;
  description: {
    state: PointDescriptionState
    value: string;
  };
  mapPosition: {
    state: PointMapPositionState;
    value: LatLng;
  };
  buildings: {
    state: PointBuildingsState;
    value: LatLng[][][];
  };
  info: {
    state: PointInfoState;
    position: LatLng;
    osm: string;
  };
  notes: string;
  wiki: PointWiki;
  monumentNo: PointMonumentNo;
  inactive?: boolean;
}

export type Points = { [key: string]: Point };

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private data: Data;

  constructor(private http: HttpClient) { }

  load(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.http
        .get('./assets/data/data.json')
        .toPromise()
        .then((res: Data) => {
          this.data = res;
          resolve();
        });
    });
  }

  async getData(): Promise<Data> {
    if (!this.data) {
      await this.load();
    }
    return new Promise((resolve, reject) => {
      resolve(this.data);
    });
  }

  async getPoint(pointId: string): Promise<{ track: Track, point: Point }> {
    if (!this.data) {
      await this.load();
    }
    return new Promise((resolve, reject) => {
      const splitId = pointId.split('.');
      const trackId = splitId.slice(0, 2).join('.');
      resolve({
        track: this.data.tracks[trackId],
        point: this.data.tracks[trackId].points[pointId]
      });
    });
  }

  async getTrack(id: string): Promise<TrackWithPoints> {
    if (!this.data) {
      await this.load();
    }
    return new Promise((resolve, reject) => {
      resolve(this.data.tracks[id]);
    });
  }

  async getTracks(): Promise<TracksWithPoints> {
    if (!this.data) {
      await this.load();
    }
    return new Promise((resolve, reject) => {
      resolve(this.data.tracks);
    });
  }
}
