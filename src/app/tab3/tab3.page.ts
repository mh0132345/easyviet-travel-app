import { Component, OnInit } from '@angular/core';
import { Ticket } from './ticket.model';
import { TicketService } from './ticket.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  loadedTickets: Ticket[] = [];

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadedTickets = this.ticketService.tickets;
  }
}
