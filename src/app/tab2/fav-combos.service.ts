import { Injectable } from '@angular/core';
import { Combo } from '../tab1/combo.model';

@Injectable({
  providedIn: 'root'
})
export class FavCombosService {
  private _favCombos: Combo[] = [
    new Combo(
      '1',
      'Chương trình combo Hạ Long 2N1D',
      'https://tour.dulichvietnam.com.vn/uploads/tour/1554713265_tour-ha-long-3.jpg',
      4000000,
      5,
      4,
      'Hà Nội',
      'Hạ Long',
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
    )
  ];
  private favId: string[] = ['1', '2', '3'];

  constructor() { }

  get favCombos() {
    return [...this._favCombos];
  }
}
