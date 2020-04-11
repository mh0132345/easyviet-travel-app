import { Injectable, NgZone } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import '@firebase/auth';
import firebase from '@firebase/app';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public _user = new BehaviorSubject<User>(null);

  constructor(
    private platform: Platform,
    private zone: NgZone,
    private fb: Facebook,
  ) { }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return !!user.token;
      } else {
        return false;
      }
    }));
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.id;
      } else {
        return null;
      }
    }));
  }

  get currentUser() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user;
      }
    }));
  }

  login() {
    // return this.browserFacebookAuth();
    if (this.platform.is('cordova')) {
      this.nativeFacebookAuth();
    } else {
      this.browserFacebookAuth();
    }
  }

  async nativeFacebookAuth() {
    this.fb.login(['email']).then((response: FacebookLoginResponse) => {
      console.log('Logged into Fb!', response);
      if (response.authResponse) {
          // Build Firebase credential with the Facebook auth token.
          const credential = firebase.auth.FacebookAuthProvider.credential(
            response.authResponse.accessToken
          );
          // Sign in with the credential from the Facebook user.
          firebase
            .auth()
            .signInWithCredential(credential)
            .then((result) => {
              console.log('Firebase success: ' + result);
              this._user.next(new User(
                result.user.uid,
                result.user.email,
                (result.credential as firebase.auth.OAuthCredential).accessToken,
                result.user.displayName,
                result.user.photoURL
              ));
            })
            .catch(error => {
              console.log(error);
            });

      } else {
        // User is signed-out of Facebook.
        firebase.auth().signOut();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  async browserFacebookAuth() {
    const provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(result => {
      console.log(result);
      this._user.next(new User(
        result.user.uid,
        result.user.email,
        (result.credential as firebase.auth.OAuthCredential).accessToken,
        result.user.displayName,
        result.user.photoURL
      ));
    }).catch(err => {
      alert(err.message);
    });
  }

  async logout(): Promise<void> {
    if (this.platform.is('cordova')) {
      try {
        await this.fb.logout();
        await firebase.auth().signOut();
        this._user.next(null);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await firebase.auth().signOut();
      } catch (err) {
        console.log(err);
      }
    }
  }
}
