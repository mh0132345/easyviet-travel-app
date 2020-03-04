import { Injectable } from '@angular/core';
import { Ticket } from './ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private _tickets: Ticket[] = [
    new Ticket(
      '1',
      'Chương trình combo Hạ Long 2N1D',
      'https://tour.dulichvietnam.com.vn/uploads/tour/1554713265_tour-ha-long-3.jpg',
      5,
      new Date('2020-02-27'),
      'Hà Nội',
      2
    )
  ];

  constructor() { }

  get tickets() {
    return [...this._tickets];
  }
}
