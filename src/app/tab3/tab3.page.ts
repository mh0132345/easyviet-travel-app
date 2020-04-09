import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ticket } from './ticket.model';
import { TicketService } from './ticket.service';
import { Combo } from '../tab1/combo.model';
import { ComboService } from '../tab1/combo.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
  loadedTickets: Ticket[] = [];
  loadedCombo: Combo[] = [];
  private ticketsSub: Subscription;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.ticketsSub = this.ticketService.tickets.subscribe(tickets => {
      this.loadedTickets = tickets.filter(
        ticket => ticket.userId === this.authService.userId
      );
    });
  }

  ngOnDestroy() {
    if (this.ticketsSub) {
      this.ticketsSub.unsubscribe();
    }
  }
}
