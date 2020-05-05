import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  private loading;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
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
      message: 'Đang đăng nhập...'
    });
    return await this.loading.present();
  }
}
