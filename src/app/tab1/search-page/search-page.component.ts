import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ComboService } from '../combo.service';
import { FavCombosService } from 'src/app/tab2/fav-combos.service';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { Combo } from '../combo.model';
import { Subscription } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SearchPageComponent implements OnInit, OnDestroy {
  searchInput: string;
  loadedCombos: Combo[] = [];
  allCombos: Combo[] = [];
  private combosSub: Subscription;
  waitMessage: string;
  addFavMessage: string;
  searchMessage: string;
  freeWifiTitle: string;
  hotelTitle: string;
  breakfastTitle: string;
  taxiTitle: string;
  bookButtonTitle: string;
  starTitle: string;
  personTitle: string;

  constructor(
    private comboService: ComboService,
    private favCombosService: FavCombosService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadingCtrl.create({
      message: this.waitMessage
    })
    .then(loadingEl => {
      loadingEl.present();
      this.combosSub = this.comboService.combos.subscribe(combos => {
        this.allCombos = combos;
      });
      this.loadedCombos = this.allCombos;
      loadingEl.dismiss();
    });
  }

  search() {
    if (!this.searchInput || this.searchInput === '') {
      this.loadedCombos = this.allCombos;
    } else {
      this.comboService.findCombo(this.searchInput).subscribe(combos => {
        this.loadedCombos = combos;
      });
    }
  }

  ngOnDestroy() {
    if (this.combosSub) {
      this.combosSub.unsubscribe();
    }
  }

  onAddingFavCombo(comboId: string, comboTitle: string, comboImgUrl: string) {
    this.favCombosService.addFavCombo(comboId, comboTitle, comboImgUrl).subscribe();
    this.toastCtrl
      .create({
        color: 'dark',
        duration: 2000,
        message: this.addFavMessage,
      })
      .then(toast => {
        toast.present();
      });
  }

  onBookingCombo(comboId: string) {
    this.router.navigate(['tabs', 'tab1', 'combo-detail', comboId]);
    this.closeModal();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  ionViewWillEnter() {
    this._initialiseTranslation();
  }

  _initialiseTranslation(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.addFavMessage = this.translateService.instant('ADDFAV');
      this.waitMessage = this.translateService.instant('WAIT');
      this.searchMessage = this.translateService.instant('SEARCH');
      this.freeWifiTitle = this.translateService.instant('FREEWIFI');
      this.hotelTitle = this.translateService.instant('HOTEL');
      this.breakfastTitle = this.translateService.instant('BREAKFAST');
      this.taxiTitle = this.translateService.instant('TAXI');
      this.bookButtonTitle = this.translateService.instant('BOOKNOW');
      this.starTitle = this.translateService.instant('STAR');
      this.personTitle = this.translateService.instant('PERSON');
    });
    this.translateService.get('ADDFAV').subscribe((res: string) => {
      this.addFavMessage = res;
    });
    this.translateService.get('WAIT').subscribe((res: string) => {
      this.waitMessage = res;
    });
    this.translateService.get('SEARCH').subscribe((res: string) => {
      this.searchMessage = res;
    });
    this.translateService.get('FREEWIFI').subscribe((res: string) => {
      this.freeWifiTitle = res;
    });
    this.translateService.get('HOTEL').subscribe((res: string) => {
      this.hotelTitle = res;
    });
    this.translateService.get('BREAKFAST').subscribe((res: string) => {
      this.breakfastTitle = res;
    });
    this.translateService.get('TAXI').subscribe((res: string) => {
      this.taxiTitle = res;
    });
    this.translateService.get('BOOKNOW').subscribe((res: string) => {
      this.bookButtonTitle = res;
    });
    this.translateService.get('STAR').subscribe((res: string) => {
      this.starTitle = res;
    });
    this.translateService.get('PERSON').subscribe((res: string) => {
      this.personTitle = res;
    });
  }
}
