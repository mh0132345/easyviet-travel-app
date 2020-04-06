import { Injectable } from '@angular/core';
import { Ticket } from './ticket.model';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private _tickets = new BehaviorSubject<Ticket[]>([
    // new Ticket(
    //   '1',
    //   '1',
    //   'Chương trình combo Hạ Long 2N1D',
    //   'https://tour.dulichvietnam.com.vn/uploads/tour/1554713265_tour-ha-long-3.jpg',
    //   5,
    //   'Hà Nội',
    //   'Le Minh Hoang',
    //   '0912345678',
    //   'test@test.com',
    //   '',
    //   '',
    //   new Date('2020-02-27'),
    //   2
    // )
  ]);

  constructor() { }

  get tickets() {
    return this._tickets.asObservable();
  }

  public addTicket(
    comboId: string,
    title: string,
    imgUrl: string,
    rate: number,
    startDest: string,
    name: string,
    phoneNumber: string,
    email: string,
    note: string,
    coupon: string,
    startDate: Date,
    numTickets: number,
  ) {
    const newTicket = new Ticket(
      Math.random().toString(),
      comboId,
      title,
      imgUrl,
      rate,
      startDest,
      name,
      phoneNumber,
      email,
      note,
      coupon,
      startDate,
      numTickets
    );
    this.tickets.pipe(take(1)).subscribe(tickets => {
      this._tickets.next(tickets.concat(newTicket));
    });
  }
}
