import { Injectable } from '@angular/core';
import { getObjectItem, setObjectItem } from '../core/storage.service';

export interface Options {
  develop: {
    showInactivePoints: boolean;
    showStatusUnknownPoints: boolean;
  }
}

const initialOptions: Options = {
  develop: {
    showInactivePoints: false,
    showStatusUnknownPoints: false,
  }
};

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  private _options: Options = initialOptions;
  get options(): Options {
    return this._options;
  }
  set options(options: Options) {
    this._options = options;
    setObjectItem('options', options);
  }

  constructor() {
    getObjectItem('options').then(item => {
      this._options = item || initialOptions;  
    });
  }

  
}
