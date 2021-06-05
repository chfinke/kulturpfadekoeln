import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { getStringItem, setStringItem } from '../core/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    public router: Router
  ) {}
  
  async canActivate(): Promise<boolean> {
    const validToken = '51105';
    const localToken = await getStringItem('token');
    if (localToken === validToken) {
      return Promise.resolve(true);
    }
    const newToken = prompt('Bitte Zugangsdaten für den Testbetrieb eingeben:');
    if (newToken === validToken) {
      setStringItem('token', newToken);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }}