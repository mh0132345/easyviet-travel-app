import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  home: string;
  favourite: string;
  tickets: string;
  account: string;

  constructor(private translateService: TranslateService) {}

  ionViewDidEnter() {
    this.translateService.setDefaultLang('en');
    this.translateService.use('vi');
    this._initialiseTranslation();
  }

  _initialiseTranslation(): void {
    this.translateService.get('HOME').subscribe((res: string) => {
      this.home = res;
    });
    this.translateService.get('FAVOURITE').subscribe((res: string) => {
      this.favourite = res;
    });
    this.translateService.get('TICKETS').subscribe((res: string) => {
      this.tickets = res;
    });
    this.translateService.get('ACCOUNT').subscribe((res: string) => {
      this.account = res;
    });
  }
}
