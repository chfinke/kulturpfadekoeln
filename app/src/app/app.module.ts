import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { NotFoundPageComponent } from './errors/not-found-page/not-found-page.component';
import { HomeAboutComponent } from './home/home-about/home-about.component';
import { HomeIntroductionComponent } from './home/home-introduction/home-introduction.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { ImprintPageComponent } from './imprint/imprint-page/imprint-page.component';
import { MapComponent } from './map/map/map.component';
import { MapPageComponent } from './map/map-page/map-page.component';
import { MapStaticComponent } from './map/map-static/map-static.component';
import { PointNavigationComponent } from './points/point-navigation/point-navigation.component';
import { PointTeaserComponent } from './points/point-teaser/point-teaser.component';
import { PointTextComponent } from './points/point-text/point-text.component';
import { TrackDoneComponent } from './tracks/track-done/track-done.component';
import { TrackInfoComponent } from './tracks/track-info/track-info.component';
import { TrackPageComponent } from './tracks/track-page/track-page.component';
import { TrackTeaserComponent } from './tracks/track-teaser/track-teaser.component';
import { TracksListComponent } from './tracks/tracks-list/tracks-list.component';
import { HeaderComponent } from './ui/header/header.component';
import { NewVersionInfoComponent } from './ui/new-version-info/new-version-info.component';
import { OptionsPageComponent } from './options/options-page/options-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    HomeAboutComponent,
    HomeIntroductionComponent,
    HomePageComponent,
    ImprintPageComponent,
    MapComponent,
    MapPageComponent,
    MapStaticComponent,
    PointNavigationComponent,
    PointTeaserComponent,
    PointTextComponent,
    TrackDoneComponent,
    TrackInfoComponent,
    TrackPageComponent,
    TrackTeaserComponent,
    TracksListComponent,
    HeaderComponent,
    NewVersionInfoComponent,
    OptionsPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.service_worker }),
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
