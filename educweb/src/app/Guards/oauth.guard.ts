import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthServiceService } from '../Services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class OauthGuard implements CanActivate, CanLoad {
  constructor(private afsAuth: AngularFireAuth, private router: Router, private oauth: AuthServiceService, private snack: MatSnackBar){}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = this.oauth.getUserRoles();
    // decode the token to get its payload
    console.log(token);
    console.log(expectedRole.includes(token))
    if (
      !this.oauth.isAuth() || 
      !expectedRole.includes(token)
    ) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
