import { Component, OnInit } from '@angular/core';
import { Combo } from '../tab1/combo.model';
import { FavCombosService } from './fav-combos.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  loadedFavCombos: Combo[] = [];
  numberOfRows: number;
  dummyArray: number[];
  constructor(private favComboService: FavCombosService) {}

  ngOnInit() {
    this.loadedFavCombos = this.favComboService.favCombos;
    const numberOfRows =  Math.round(this.loadedFavCombos.length / 2);
    this.dummyArray = new Array(numberOfRows);
  }

}
