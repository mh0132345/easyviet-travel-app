import { Injectable } from '@angular/core';
import { Combo } from './combo.model';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

@Injectable({
  providedIn: 'root'
})
export class ComboService {
  private _combos: Combo[] = [
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

  constructor() { }

  get combos() {
    return [...this._combos];
  }

  getCombo(id: string) {
    return {...this._combos.find(c => c.id === id)};
  }
}
