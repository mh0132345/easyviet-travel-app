import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ComboService } from '../combo.service';
import { FavCombosService } from 'src/app/tab2/fav-combos.service';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { Combo } from '../combo.model';
import { Subscription } from 'rxjs';

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

  constructor(
    private comboService: ComboService,
    private favCombosService: FavCombosService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.loadingCtrl.create({
      message: 'Vui lòng chờ một chút...'
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
    console.log(this.searchInput);
    if (this.searchInput === '') {
      this.loadedCombos = this.allCombos;
    } else {
      this.comboService.findCombo(this.searchInput).subscribe(combos => {
        console.log(combos);
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
        message: 'Đã thêm vào yêu thích',
      })
      .then(toast => {
        toast.present();
      });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
