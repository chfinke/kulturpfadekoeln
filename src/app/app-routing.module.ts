import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from './home/home-page/home-page.component';
import { MapPageComponent } from './map/map-page/map-page.component';
import { TrackPageComponent } from './tracks/track-page/track-page.component';
import { NotFoundPageComponent } from './errors/not-found-page/not-found-page.component';
import { ImprintPageComponent } from './imprint/imprint-page/imprint-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    pathMatch: 'full'
  },
  {
    path: 'map',
    component: MapPageComponent,
  },
  {
    path: 'overview',
    component: TrackPageComponent,
  },
  {
    path: 'imprint',
    component: ImprintPageComponent,
  },
  {
    path: 'fehler-404',
    component: NotFoundPageComponent,
  },
  {
    path: '**',
    redirectTo: 'fehler-404',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
