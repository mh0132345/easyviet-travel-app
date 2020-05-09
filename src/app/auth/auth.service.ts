import { Injectable, NgZone } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import '@firebase/auth';
import firebase from '@firebase/app';
import { Platform, AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public _user = new BehaviorSubject<User>(null);
  phoneNumberRef: AngularFireObject<any>;
  errorTitle: string;
  errorMessage: string;

  constructor(
    private platform: Platform,
    private fb: Facebook,
    private db: AngularFireDatabase,
    private alertController: AlertController,
    private translateService: TranslateService,
  ) {
    this.translateService.get('ERROR').subscribe((res: string) => {
      this.errorTitle = res;
    });
    this.translateService.get('ERRORMESSAGE').subscribe((res: string) => {
      this.errorMessage = res;
    });
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return !!user.id;
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

  async login() {
    // return this.browserFacebookAuth();
    if (this.platform.is('cordova')) {
      await this.nativeFacebookAuth();
    } else {
      await this.browserFacebookAuth();
    }
  }

  async nativeFacebookAuth() {
    return this.fb.login(['email']).then((response: FacebookLoginResponse) => {
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
              this.setCurrentUser(
                result.user.uid,
                result.user.email,
                result.user.displayName,
                result.user.photoURL,
              );
            })
            .catch(error => {
              this.presentAlert(this.errorTitle, this.errorMessage);
            });

      } else {
        // User is signed-out of Facebook.
        firebase.auth().signOut();
      }
    }).catch(err => {
      this.presentAlert(this.errorTitle, this.errorMessage);
    });
  }

  async browserFacebookAuth() {
    const provider = new firebase.auth.FacebookAuthProvider();

    return firebase.auth().signInWithPopup(provider).then(result => {
      this.setCurrentUser(
        result.user.uid,
        result.user.email,
        result.user.displayName,
        result.user.photoURL,
      );
    }).catch(err => {
      this.presentAlert(this.errorTitle, this.errorMessage);
    });
  }

  async logout(): Promise<void> {
    if (this.platform.is('cordova')) {
      try {
        await this.fb.logout();
        await firebase.auth().signOut();
        this._user.next(null);
      } catch (err) {
        this.presentAlert(this.errorTitle, this.errorMessage);
      }
    } else {
      try {
        await firebase.auth().signOut();
      } catch (err) {
        this.presentAlert(this.errorTitle, this.errorMessage);
      }
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  setCurrentUser(uid: string, email: string, displayName: string, photoURL: string) {
    this._user.next(new User(
      uid,
      email,
      displayName,
      photoURL,
    ));
  }

  public setUserPhoneNumber(uid: string, phoneNumber: string) {
    this.phoneNumberRef = this.db.object(`users/${uid}/profile`);
    this.phoneNumberRef.set({phoneNumber});
  }

  public updateDisplayName(displayName: string) {
    firebase.auth().currentUser.updateProfile({
      displayName,
    });
  }

  public getUserPhoneNumber(uid: string) {
    this.phoneNumberRef = this.db.object(`users/${uid}/profile/phoneNumber`);
    return this.phoneNumberRef.valueChanges();
  }

  ionViewWillEnter() {
    this._initialiseTranslation();
  }

  _initialiseTranslation(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.errorTitle = this.translateService.instant('ERROR');
      this.errorMessage = this.translateService.instant('ERRORMESSAGE');
    });
  }
}
