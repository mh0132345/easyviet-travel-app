import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ticket } from './ticket.model';
import { TicketService } from './ticket.service';
import { Combo } from '../tab1/combo.model';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
  loadedTickets: Ticket[] = [];
  loadedCombo: Combo[] = [];
  isLoading = false;
  private ticketsSub: Subscription;

  constructor(
    private ticketService: TicketService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadingCtrl.create({
      message: 'Đang tải vé của bạn...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.ticketsSub = this.ticketService.tickets.subscribe(tickets => {
        this.loadedTickets = tickets;
        loadingEl.dismiss();
      });
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.ticketService.fetchTickets().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.ticketsSub) {
      this.ticketsSub.unsubscribe();
    }
  }
}
