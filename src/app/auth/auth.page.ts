import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  private loading;
  private waitMessage: string;
  loginButtonTitle: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService,
  ) {
  }

  async login() {
    this.showLoading();
    this.authService.login().then(() => {
      this.loading.dismiss();
      this.router.navigateByUrl('/tabs/tab1');
    });
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: this.waitMessage
    });
    return await this.loading.present();
  }

  ionViewWillEnter() {
    this._initialiseTranslation();
  }

  _initialiseTranslation(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.waitMessage = this.translateService.instant('WAIT');
      this.loginButtonTitle = this.translateService.instant('ERRORMESSAGE');
    });
    this.translateService.get('WAIT').subscribe((res: string) => {
      this.waitMessage = res;
    });
    this.translateService.get('LOGIN').subscribe((res: string) => {
      this.loginButtonTitle = res;
    });
  }
}
