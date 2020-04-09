import { Injectable } from '@angular/core';
import { Ticket } from './ticket.model';
import { AuthService } from '../auth/auth.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  ticketListRef: AngularFireList<any>;

  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase,
  ) { }

  get tickets() {
    const uid = this.authService.userId;
    return this.db.list<Ticket>(`users/${uid}/tickets`).valueChanges();
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
      moment(startDate).unix(),
      numTickets
    );
    const uid = this.authService.userId;
    this.ticketListRef = this.db.list(`users/${uid}/tickets`);
    this.ticketListRef.push({...newTicket, id: null});
    return this.ticketListRef.valueChanges();
  }
}
