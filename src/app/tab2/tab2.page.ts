import { Component, OnInit, OnDestroy } from '@angular/core';
import { Combo } from '../tab1/combo.model';
import { FavCombosService } from './fav-combos.service';
import { ComboService } from '../tab1/combo.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  loadedFavCombos: Combo[] = [];
  numberOfRows: number;
  dummyArray: number[];

  private favCombosSub: Subscription;
  private combosSub: Subscription;
  constructor(
    private favComboService: FavCombosService,
    private comboService: ComboService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.favCombosSub = this.favComboService.favCombos.subscribe(favCombos => {
      favCombos.forEach((favCombo) => {
        if (favCombo.userId === this.authService.userId) {
          this.combosSub = this.comboService.getCombo(favCombo.comboId).subscribe(combo => {
            this.loadedFavCombos.push(combo);
          });
        }
      });
    });

    const numberOfRows =  Math.round(this.loadedFavCombos.length / 2);
    this.dummyArray = new Array(numberOfRows);
  }

  ngOnDestroy() {
    if (this.favCombosSub) {
      this.favCombosSub.unsubscribe();
    }
    if (this.combosSub) {
      this.combosSub.unsubscribe();
    }
  }
}
