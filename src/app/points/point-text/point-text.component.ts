import { Component, Input, OnChanges } from '@angular/core';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { MonumentNoItem, Point, Track, WikiItem, PointWiki, PointMonumentNo, PointWikiState, PointMonumentNoState } from '../../map/data.service';

@Component({
  selector: 'app-point-text',
  templateUrl: './point-text.component.html',
  styleUrls: ['./point-text.component.css']
})
export class PointTextComponent implements OnChanges {
  @Input() point: Point;
  @Input() track: Track;

  wikiArray: WikiItem[] = [];
  monumentNoArray: MonumentNoItem[] = [];
  geoHref: SafeUrl = '';

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(): void {
    this.wikiArray = this.getWikiArray(this.point.wiki);
    this.monumentNoArray = this.getMonumentNoArray(this.point.monumentNo);

    this.geoHref = this.sanitizer.bypassSecurityTrustUrl(`geo:${this.point.mapPosition.value[1]},${this.point.mapPosition.value[0]}`);
  }

  getWikiArray(wiki: PointWiki): WikiItem[] {
    if (Array.isArray(wiki.value)) {
      return (wiki.value as WikiItem[]);
    }
    if ([PointWikiState.Unknown, PointWikiState.Na].includes(wiki.state)) {
      return [];
    }
    return [{identifier: (wiki.value as string), title: ''}];
  }

  getMonumentNoArray(monumentNo: PointMonumentNo): MonumentNoItem[] {
    if (Array.isArray(monumentNo.value)) {
      return monumentNo.value;
    }
    if ([PointMonumentNoState.Unknown, PointMonumentNoState.Na].includes(monumentNo.state)) {
      return [];
    }
    return [{number: +monumentNo.value, title: ''}];
  }
}
