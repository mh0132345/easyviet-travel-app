import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  languageTitle: string;
  language: string;
  storage = new Storage({name: '__ionicTravelApp'});
  vnButtonColor: string;
  enButtonColor: string;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.languageTitle = this.translateService.instant('LANGUAGE');
    });
    this.language = this.translateService.currentLang;
    this.translateService.get('LANGUAGE').subscribe((res: string) => {
      this.languageTitle = res;
    });
  }
  setVietnamese() {
    this.translateService.use('vi');
    this.language = 'vi';
    this.storage.set('ionicLang', 'vi');
  }

  setEnglish() {
    this.translateService.use('en');
    this.language = 'en';
    this.storage.set('ionicLang', 'en');
  }
}
