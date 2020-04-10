import { Injectable } from '@angular/core';
import { FavCombo } from './favCombo.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AngularFireDatabase, AngularFireList, AngularFireObject  } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FavCombosService {
  favComboListRef: AngularFireList<any>;
  favComboRef: AngularFireObject<any>;

  private _favCombos = new BehaviorSubject<FavCombo[]>([]);

  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase,
  ) { }

  get favCombos() {
    const uid = this.authService.userId;
    this.db.list<FavCombo>(`users/${uid}/favcombos`).snapshotChanges().subscribe(res => {
      const favComboList = [];
      res.forEach(item => {
        const combo = item.payload.toJSON();
        const id = item.key;
        favComboList.push({...combo, id});
      });
      this._favCombos.next(favComboList);
    });
    return this._favCombos.asObservable();
  }

  public addFavCombo(comboId: string, comboTitle: string, comboImgUrl: string) {
    const newFavCombo = new FavCombo(Math.random().toString(), comboId, comboTitle, comboImgUrl);
    const uid = this.authService.userId;
    this.favComboListRef = this.db.list(`users/${uid}/favcombos`);
    this.favComboListRef.push({...newFavCombo, id: null});
  }

  public removeFavCombo(favId: string) {
    const uid = this.authService.userId;
    this.favComboRef = this.db.object(`users/${uid}/favcombos/${favId}`);
    this.favComboRef.remove();
  }
}
