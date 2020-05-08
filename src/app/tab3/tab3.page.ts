import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ticket } from './ticket.model';
import { TicketService } from './ticket.service';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
  loadedTickets: Ticket[] = [];
  isLoading = false;
  private ticketsSub: Subscription;
  yourTicket: string;
  noTicketNotice: string;
  from: string;
  ticketUnit: string;
  appliedMessage: string;
  waitMessage: string;
  discover: string;

  constructor(
    private ticketService: TicketService,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loadingCtrl.create({
      message: this.waitMessage
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
    this._initialiseTranslation();
  }

  ngOnDestroy() {
    if (this.ticketsSub) {
      this.ticketsSub.unsubscribe();
    }
  }

  _initialiseTranslation(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.yourTicket = this.translateService.instant('YOURTICKETS');
      this.waitMessage = this.translateService.instant('WAIT');
      this.noTicketNotice = this.translateService.instant('NOTICKET');
      this.from = this.translateService.instant('FROM');
      this.ticketUnit = this.translateService.instant('TICKETUNIT');
      this.appliedMessage = this.translateService.instant('APPLIED');
      this.discover = this.translateService.instant('DISCOVER');
    });
    this.translateService.get('YOURTICKETS').subscribe((res: string) => {
      this.yourTicket = res;
    });
    this.translateService.get('WAIT').subscribe((res: string) => {
      this.waitMessage = res;
    });
    this.translateService.get('NOTICKET').subscribe((res: string) => {
      this.noTicketNotice = res;
    });
    this.translateService.get('FROM').subscribe((res: string) => {
      this.from = res;
    });
    this.translateService.get('TICKETUNIT').subscribe((res: string) => {
      this.ticketUnit = res;
    });
    this.translateService.get('APPLIED').subscribe((res: string) => {
      this.appliedMessage = res;
    });
    this.translateService.get('DISCOVER').subscribe((res: string) => {
      this.discover = res;
    });
  }
}
