import { Injectable } from '@angular/core';
import { UrlTree, Router, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import '@firebase/auth';
import firebase from '@firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          this.authService.setCurrentUser(user.uid, user.email, user.displayName, user.photoURL);
          resolve(true);
        } else {
          this.router.navigateByUrl('/auth');
          resolve(false);
        }
      });
    });
  }
}
