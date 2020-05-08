import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../auth/user.model';
import { take } from 'rxjs/operators';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  currentUser: User;
  info: string;
  languageTitle: string;
  helpTitle: string;
  logOutTitle: string;
  versionTitle: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.authService.currentUser.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

  ionViewDidEnter() {
    this._initialiseTranslation();
  }

  _initialiseTranslation(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.info = this.translateService.instant('INFO');
      this.languageTitle = this.translateService.instant('LANGUAGE');
      this.helpTitle = this.translateService.instant('HELP');
      this.logOutTitle = this.translateService.instant('LOGOUT');
      this.versionTitle = this.translateService.instant('VERSION');
    });
    this.translateService.get('INFO').subscribe((res: string) => {
      this.info = res;
    });
    this.translateService.get('LANGUAGE').subscribe((res: string) => {
      this.languageTitle = res;
    });
    this.translateService.get('HELP').subscribe((res: string) => {
      this.helpTitle = res;
    });
    this.translateService.get('LOGOUT').subscribe((res: string) => {
      this.logOutTitle = res;
    });
    this.translateService.get('VERSION').subscribe((res: string) => {
      this.versionTitle = res;
    });
  }
}
