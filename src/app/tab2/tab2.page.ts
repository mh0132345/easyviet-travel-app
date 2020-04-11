import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavCombosService } from './fav-combos.service';
import { Subscription } from 'rxjs';
import { FavCombo } from './favCombo.model';
import { LoadingController } from '@ionic/angular';

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

  private favCombosSub: Subscription;
  constructor(
    private favComboService: FavCombosService,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.loadingCtrl.create({
      message: 'Đang tải vé của bạn...'
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
  }

  onRemoveFavCombo(favComboId: string) {
    this.favComboService.removeFavCombo(favComboId);
  }

  ngOnDestroy() {
    if (this.favCombosSub) {
      this.favCombosSub.unsubscribe();
    }
  }
}
