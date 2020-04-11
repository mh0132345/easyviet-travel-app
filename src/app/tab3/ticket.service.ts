import { Injectable } from '@angular/core';
import { Ticket } from './ticket.model';
import { AuthService } from '../auth/auth.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { take, switchMap, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private _ticket = new BehaviorSubject<Ticket[]>([]);
  ticketListRef: AngularFireList<any>;

  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase,
  ) { }

  get tickets() {
    return this._ticket.asObservable();
  }

  fetchTickets() {
    return this.authService.userId.pipe(
      switchMap(uid => {
        if (!uid) {
          throw new Error('User not found!');
        }
        console.log(uid);
        this.ticketListRef = this.db.list<Ticket>(`users/${uid}/tickets`);
        return this.ticketListRef.snapshotChanges();
      }),
      map(res => {
        console.log(res);
        const ticketList = [];
        res.forEach(item => {
          const combo = item.payload.toJSON();
          const id = item.key;
          ticketList.push({...combo, id});
        });
        return ticketList;
      }),
      tap(ticketList => {
        console.log(ticketList);
        this._ticket.next(ticketList);
      })
    );
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
    this.authService.userId.pipe(take(1)).subscribe(uid => {
      this.ticketListRef = this.db.list(`users/${uid}/tickets`);
      this.ticketListRef.push({...newTicket, id: null});
    });
    return this.ticketListRef.valueChanges();
  }
}
