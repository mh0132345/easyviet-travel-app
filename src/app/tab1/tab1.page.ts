import { Component, OnInit, OnDestroy } from '@angular/core';
import { Combo } from './combo.model';
import { ComboService } from './combo.service';
import { Article } from './article.model';
import { ArticleService } from './article.service';
import { Subscription } from 'rxjs';
import { FavCombosService } from '../tab2/fav-combos.service';
import { LoadingController, ToastController } from '@ionic/angular';

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

  constructor(
    private comboService: ComboService,
    private articleService: ArticleService,
    private favCombosService: FavCombosService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.loadingCtrl.create({
      message: 'Vui lòng chờ một chút...'
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
        message: 'Đã thêm vào yêu thích',
      })
      .then(toast => {
        toast.present();
      });
  }
}
