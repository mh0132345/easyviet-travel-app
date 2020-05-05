import { Injectable } from '@angular/core';
import { Combo, AvailableWeek, Coupon } from './combo.model';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ComboService {
  comboListRef: AngularFireList<any>;
  private _combos = new BehaviorSubject<Combo[]>([]);

  constructor(private db: AngularFireDatabase) { }

  get combos() {
    this.db.list<Combo>(`combos`).snapshotChanges().subscribe(res => {
      const comboList = [];
      res.forEach(item => {
        const combo = item.payload.toJSON();
        const id = item.key;
        comboList.push({...combo, id});
      });
      this._combos.next(comboList);
    });
    return this._combos.asObservable();
  }

  getCombo(id: string) {
    return this.combos.pipe(
      take(1),
      map(combos => {
        return {...combos.find(c => c.id === id)};
      })
    );
  }

  public addCombo(newCombo: Combo) {
    this.comboListRef = this.db.list(`combos`);
    this.comboListRef.push({...newCombo, id: null});
  }

  public addTestCombos() {
    const coupon: Coupon = { test: 500000};
    const combos = [
      new Combo(
        '1',
        'Chương trình combo Hạ Long 2N1D',
        'https://tour.dulichvietnam.com.vn/uploads/tour/1554713265_tour-ha-long-3.jpg',
        4000000,
        5,
        4,
        'Hà Nội',
        'Hạ Long',
        true,
        true,
        4,
        true,
        'Vịnh Hạ Long nổi tiếng trong nước và quốc tế',
        new AvailableWeek(false, false, false, false, true, false, false),
        coupon,
      ),
      new Combo(
        '2',
        'Chương trình combo Đà Lạt 2N1D',
        'https://tour.dulichvietnam.com.vn/uploads/tour/1554713265_tour-ha-long-3.jpg',
        8000000,
        5,
        4,
        'Hà Nội',
        'Hạ Long',
        true,
        true,
        4,
        true,
        'Vịnh Hạ Long nổi tiếng trong nước và quốc tế',
        new AvailableWeek(false, false, false, true, false, false, false),
        coupon,
      ),
      new Combo(
        '3',
        'Chương trình combo Vũ Hán 2N1D',
        'https://tour.dulichvietnam.com.vn/uploads/tour/1554713265_tour-ha-long-3.jpg',
        15000000,
        5,
        4,
        'Hà Nội',
        'Hạ Long',
        true,
        true,
        4,
        true,
        'Vịnh Hạ Long nổi tiếng trong nước và quốc tế',
        new AvailableWeek(false, false, false, false, true, false, false),
        coupon,
      )
    ];
    combos.forEach(combo => {
      this.addCombo(combo);
    });
  }
}
