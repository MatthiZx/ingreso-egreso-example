import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor( public authService: AuthService ) { }

  // canActivate espera una promesa o un boolean
  canActivate(){
    return  this.authService.isAuth();
  }
}
