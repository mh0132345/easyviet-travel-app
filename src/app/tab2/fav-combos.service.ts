import { Injectable } from '@angular/core';
import { ComboService } from '../tab1/combo.service';
import { FavCombo } from './favCombo.model';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavCombosService {
  private _favCombos = new BehaviorSubject<FavCombo[]>([
    new FavCombo(
      '1',
      '1'
    ),
    new FavCombo(
      '2',
      '2'
    ),
    new FavCombo(
      '3',
      '3'
    ),
  ]);

  constructor() { }

  get favCombos() {
    return this._favCombos.asObservable();
  }

  public addFavCombo(favId: string) {
    const newFavCombo = new FavCombo(Math.random().toString(), favId);
    this.favCombos.pipe(take(1)).subscribe(favCombos => {
      this._favCombos.next(favCombos.concat(newFavCombo));
    });
  }
}
