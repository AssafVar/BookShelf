import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import jwt_decode from 'jwt-decode'
import { GlobalContants } from '../shared/global-constants';
@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackbarService: SnackbarService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRouteArray = route.data;
    expectedRouteArray = expectedRouteArray['expectedRole'];
    const token = localStorage.getItem('token')??'';
    let tokenPayload:any;

    try{
      tokenPayload = jwt_decode(token);
    }catch(err){
      localStorage.clear();
      this.router.navigate(['']);
    };

    let checkRole = false;
    for (let role in expectedRouteArray){
      if (role == tokenPayload.role){
        checkRole = true;
      }
    }
    if (tokenPayload.role == 'user' || tokenPayload.role == 'admin'){
      if (this.auth.isAuthenticated() && checkRole) {
        return true;
      }
      this.snackbarService.openSnackbar(GlobalContants.unuothorized, GlobalContants.error);
      this.router.navigate(['/eCommerce/dashboard']);
      return false;
    }else{
      localStorage.clear();
      this.router.navigate(['/']);
      return false;
    }
  }
}
