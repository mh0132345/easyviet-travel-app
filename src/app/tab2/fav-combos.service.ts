import { Injectable } from '@angular/core';
import { FavCombo } from './favCombo.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AngularFireDatabase, AngularFireList, AngularFireObject  } from '@angular/fire/database';
import { take, switchMap, map, tap } from 'rxjs/operators';

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
    return this._favCombos.asObservable();
  }


  fetchFavCombos() {
    return this.authService.userId.pipe(
      switchMap(uid => {
        if (!uid) {
          throw new Error('User not found!');
        }
        console.log(uid);
        return this.db.list<FavCombo>(`users/${uid}/favcombos`).snapshotChanges();
      }),
      map(res => {
        console.log(res);
        const favComboList = [];
        res.forEach(item => {
          const combo = item.payload.toJSON();
          const id = item.key;
          favComboList.push({...combo, id});
        });
        return favComboList;
      }),
      tap(favComboList => {
        console.log(favComboList);
        this._favCombos.next(favComboList);
      })
    );
  }

  public addFavCombo(comboId: string, comboTitle: string, comboImgUrl: string) {
    let newFavCombo: FavCombo;
    let generatedId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(uid => {
        console.log(uid);
        if (!uid) {
          throw new Error('No user id found!');
        }
        newFavCombo = new FavCombo(Math.random().toString(), comboId, comboTitle, comboImgUrl);
        console.log(newFavCombo);
        this.favComboListRef = this.db.list(`users/${uid}/favcombos`);
        return this.favComboListRef.push({...newFavCombo, id: null});
      }),
      switchMap(resData => {
        console.log(resData);
        generatedId = resData.key;
        return this.favCombos;
      }),
      take(1),
      tap(favCombos => {
        newFavCombo.id = generatedId;
        this._favCombos.next(favCombos.concat(newFavCombo));
      })
    );
  }

  public removeFavCombo(favId: string) {
    this.authService.userId.pipe(take(1)).subscribe(uid => {
      if (!uid) {
        throw new Error('No user id found!');
      }
      this.favComboRef = this.db.object(`users/${uid}/favcombos/${favId}`);
      this.favComboRef.remove();
    });
  }
}
