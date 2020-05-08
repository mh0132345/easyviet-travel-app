import { Component, OnInit, OnDestroy } from '@angular/core';
import { Combo } from './combo.model';
import { ComboService } from './combo.service';
import { Article } from './article.model';
import { ArticleService } from './article.service';
import { Subscription } from 'rxjs';
import { FavCombosService } from '../tab2/fav-combos.service';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { SearchPageComponent } from './search-page/search-page.component';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  loadedCombos: Combo[] = [];
  loadedArticles: Article[] = [];
  private combosSub: Subscription;
  private articlesSub: Subscription;
  articlePart: string;
  waitMessage: string;
  addFavMessage: string;
  searchMessage: string;

  slideOpts = {
    slidesPerView: 1.5,
    spaceBetween: 10
  };

  constructor(
    private comboService: ComboService,
    private articleService: ArticleService,
    private favCombosService: FavCombosService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.loadingCtrl.create({
      message: this.waitMessage
    })
    .then(loadingEl => {
      loadingEl.present();
      this.combosSub = this.comboService.combos.subscribe(combos => {
        this.loadedCombos = combos;
      });
      this.articlesSub = this.articleService.articles.subscribe(articles => {
        this.loadedArticles = articles;
      });
      loadingEl.dismiss();
    });
  }

  ngOnDestroy() {
    if (this.combosSub) {
      this.combosSub.unsubscribe();
    }
    if (this.articlesSub) {
      this.articlesSub.unsubscribe();
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

  submitSearch() {
    this.modalCtrl.create({
      component: SearchPageComponent,
    }).then(modalEl => {
      modalEl.present();
    });
  }

  ionViewDidEnter() {
    this._initialiseTranslation();
  }

  _initialiseTranslation(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.articlePart = this.translateService.instant('ARTICLES');
      this.waitMessage = this.translateService.instant('WAIT');
      this.addFavMessage = this.translateService.instant('ADDFAV');
      this.searchMessage = this.translateService.instant('SEARCH');
    });
    this.translateService.get('ARTICLES').subscribe((res: string) => {
      this.articlePart = res;
    });
    this.translateService.get('WAIT').subscribe((res: string) => {
      this.waitMessage = res;
    });
    this.translateService.get('ADDFAV').subscribe((res: string) => {
      this.addFavMessage = res;
    });
    this.translateService.get('SEARCH').subscribe((res: string) => {
      this.searchMessage = res;
    });
  }
}
