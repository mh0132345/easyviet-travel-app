import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { take } from 'rxjs/operators';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.page.html',
  styleUrls: ['./account-info.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AccountInfoPage implements OnInit {
  currentUser: User;
  info: string;
  customerNameField: string;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.authService.currentUser.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
      this.authService.getUserPhoneNumber(this.currentUser.id).subscribe(phoneNumber => {
        this.currentUser.phoneNumber = phoneNumber;
      });
    });
  }

  updateName() {
    this.authService.updateDisplayName(this.currentUser.name);
  }

  updatePhoneNumber() {
    this.authService.setUserPhoneNumber(this.currentUser.id, this.currentUser.phoneNumber);
  }

  ionViewDidEnter() {
    this._initialiseTranslation();
  }

  _initialiseTranslation(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.info = this.translateService.instant('INFO');
      this.customerNameField = this.translateService.instant('CUSTOMERNAME');
    });
    this.translateService.get('INFO').subscribe((res: string) => {
      this.info = res;
    });
    this.translateService.get('CUSTOMERNAME').subscribe((res: string) => {
      this.customerNameField = res;
    });
  }
}
