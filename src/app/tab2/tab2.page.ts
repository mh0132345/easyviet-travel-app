import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavCombosService } from './fav-combos.service';
import { Subscription } from 'rxjs';
import { FavCombo } from './favCombo.model';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  loadedFavCombos: FavCombo[];
  numberOfRows: number;
  dummyArray: number[];
  isLoading = false;
  fav: string;
  noFavNotice: string;
  discover: string;
  waitMessage: string;
  removeFavMessage: string;

  private favCombosSub: Subscription;
  constructor(
    private favComboService: FavCombosService,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadingCtrl.create({
      message: this.waitMessage
    })
    .then(loadingEl => {
      loadingEl.present();
      this.favCombosSub = this.favComboService.favCombos.subscribe(favCombos => {
        this.loadedFavCombos = favCombos;
        const numberOfRows =  Math.round(this.loadedFavCombos.length / 2);
        this.dummyArray = new Array(numberOfRows);
        loadingEl.dismiss();
      });
    });

  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.favComboService.fetchFavCombos().subscribe(() => {
      this.isLoading = false;
    });
    this._initialiseTranslation();
  }

  onRemoveFavCombo(favComboId: string) {
    this.favComboService.removeFavCombo(favComboId);
    this.toastCtrl
    .create({
      color: 'dark',
      duration: 2000,
      message: this.removeFavMessage,
    })
    .then(toast => {
      toast.present();
    });
  }

  ngOnDestroy() {
    if (this.favCombosSub) {
      this.favCombosSub.unsubscribe();
    }
  }

  _initialiseTranslation(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.fav = this.translateService.instant('FAV');
      this.waitMessage = this.translateService.instant('WAIT');
      this.noFavNotice = this.translateService.instant('NOFAV');
      this.discover = this.translateService.instant('DISCOVER');
      this.removeFavMessage = this.translateService.instant('RMFAV');
    });
    this.translateService.get('FAV').subscribe((res: string) => {
      this.fav = res;
    });
    this.translateService.get('WAIT').subscribe((res: string) => {
      this.waitMessage = res;
    });
    this.translateService.get('NOFAV').subscribe((res: string) => {
      this.noFavNotice = res;
    });
    this.translateService.get('DISCOVER').subscribe((res: string) => {
      this.discover = res;
    });
    this.translateService.get('RMFAV').subscribe((res: string) => {
      this.removeFavMessage = res;
    });
  }
}
