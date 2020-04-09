import { Injectable } from '@angular/core';
import { ComboService } from '../tab1/combo.service';
import { FavCombo } from './favCombo.model';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavCombosService {
  private _favCombos = new BehaviorSubject<FavCombo[]>([
    new FavCombo(
      '1',
      '1',
      'abc'
    ),
    new FavCombo(
      '2',
      '2',
      'abc'
    ),
    new FavCombo(
      '3',
      '3',
      'abc'
    ),
    new FavCombo(
      '3',
      '3',
      'def'
    ),
  ]);

  constructor(private authService: AuthService) { }

  get favCombos() {
    return this._favCombos.asObservable();
  }

  public addFavCombo(favId: string) {
    const newFavCombo = new FavCombo(Math.random().toString(), favId, this.authService.userId);
    this.favCombos.pipe(take(1)).subscribe(favCombos => {
      this._favCombos.next(favCombos.concat(newFavCombo));
    });
  }
}
