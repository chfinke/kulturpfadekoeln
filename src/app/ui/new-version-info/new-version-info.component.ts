import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

const FORCED_DISPLAY = false;

@Component({
  selector: 'app-new-version-info',
  templateUrl: './new-version-info.component.html',
  styleUrls: ['./new-version-info.component.css'],
})
export class NewVersionInfoComponent implements OnInit, OnDestroy {
  forced: boolean;
  visible: boolean;
  subscription: Subscription;
  constructor(private swUpdate: SwUpdate) {
    this.forced = FORCED_DISPLAY;
  }

  ngOnInit(): void {
    this.visible = false;
    if (this.swUpdate.isEnabled) {
      this.subscription = this.swUpdate.available.subscribe(() => {
        this.visible = true;
      });
    }
  }

  update(): void {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
