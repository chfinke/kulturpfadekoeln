import { Component } from '@angular/core';
import { OptionsService } from '../options.service';
import { set } from 'lodash';

@Component({
  selector: 'app-options-page',
  templateUrl: './options-page.component.html',
  styleUrls: ['./options-page.component.css']
})
export class OptionsPageComponent {

  constructor(
    public service: OptionsService,
  ) {}

  onChange(cb, field) {
    this.service.options = set(this.service.options, field, cb.currentTarget.checked);
  }

}
