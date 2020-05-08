import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  language: string;
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
  }

  setEnglish() {
    this.translateService.use('en');
  }
}
