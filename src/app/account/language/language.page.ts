import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  language: string;
  storage = new Storage({name: '__ionicTravelApp'});

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.language = this.translateService.instant('LANGUAGE');
    });
    this.translateService.get('LANGUAGE').subscribe((res: string) => {
      this.language = res;
    });
  }
  setVietnamese() {
    this.translateService.use('vi');
    this.storage.set('ionicLang', 'vi');
  }

  setEnglish() {
    this.translateService.use('en');
    this.storage.set('ionicLang', 'en');
  }
}
