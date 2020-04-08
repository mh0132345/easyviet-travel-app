import { Injectable } from '@angular/core';
import { Combo } from './combo.model';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComboService {
  private _combos = new BehaviorSubject<Combo[]>([
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
      'Vịnh Hạ Long nổi tiếng trong nước và quốc tế'

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
      'Vịnh Hạ Long nổi tiếng trong nước và quốc tế'
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
      'Vịnh Hạ Long nổi tiếng trong nước và quốc tế'
    )
  ]);

  constructor() { }

  get combos() {
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
}
