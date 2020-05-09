import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {
  successMessage: string;
  completeButtonTitle: string;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this._initialiseTranslation();
  }

  _initialiseTranslation(): void {
    this.successMessage = this.translateService.instant('SUCCESS');
    this.completeButtonTitle = this.translateService.instant('COMPLETE');
    this.translateService.get('SUCCESS').subscribe((res: string) => {
      this.successMessage = res;
    });
    this.translateService.get('COMPLETE').subscribe((res: string) => {
      this.completeButtonTitle = res;
    });
  }
}
