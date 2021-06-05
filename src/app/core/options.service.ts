import { Injectable } from '@angular/core';
import { getObjectItem, setObjectItem } from './storage.service';

export interface Options {
  develop: {
    showInactivePoints: boolean;
    showStatusCheckPoints: boolean;
    showStatusUnknownPoints: boolean;
  }
}

const initialOptions: Options = {
  develop: {
    showInactivePoints: false,
    showStatusCheckPoints: false,
    showStatusUnknownPoints: false,
  }
};

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  private _options: Options;
  get options(): Options {
    // return this._options;
    return {
      develop: {
        showInactivePoints: true,
        showStatusCheckPoints: true,
        showStatusUnknownPoints: true,
      }
    };
  }

  constructor() {
    getObjectItem('options').then(item => this._options = item || initialOptions);
  }
}
