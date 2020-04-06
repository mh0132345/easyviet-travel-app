import { Component, OnInit } from '@angular/core';
import { Ticket } from './ticket.model';
import { TicketService } from './ticket.service';
import { Combo } from '../tab1/combo.model';
import { ComboService } from '../tab1/combo.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  loadedTickets: Ticket[] = [];
  loadedCombo: Combo[] = [];

  constructor(
    private ticketService: TicketService,
    private comboService: ComboService,
  ) {}

  ngOnInit() {
    this.loadedTickets = this.ticketService.tickets;
    this.loadedTickets.forEach(ticket => {
      const newCombo = this.comboService.getCombo(ticket.comboId);
      this.loadedCombo.push(newCombo);
    });
  }
}
