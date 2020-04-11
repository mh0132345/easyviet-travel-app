import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  private loading;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
  ) {
  }

  ngOnInit() {
    this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (isAuth) {
        this.loading.dismiss();
      }
    });
  }

  async login() {
    await this.showLoading();
    this.authService.login();
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Đang đăng nhập...'
    });
    this.loading.present();
  }
}
