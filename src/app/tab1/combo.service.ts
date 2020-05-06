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

  findCombo(travelDest: string) {
    return this.combos.pipe(
      take(1),
      map(combos => {
        return combos.filter(
          c => this.changeAlias(c.travelDest).toLowerCase().includes(this.changeAlias(travelDest).toLowerCase())
        );
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

  private changeAlias(input: string) {
    // Convert special Vietnamese character to English character
    let str = input;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    return str;
  }
}
