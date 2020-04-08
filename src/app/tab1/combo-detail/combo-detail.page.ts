import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Combo } from '../combo.model';
import { ComboService } from '../combo.service';
import { TicketService } from 'src/app/tab3/ticket.service';
import { BookingsComponent } from 'src/app/tab3/bookings/bookings.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-combo-detail',
  templateUrl: './combo-detail.page.html',
  styleUrls: ['./combo-detail.page.scss'],
})
export class ComboDetailPage implements OnInit, OnDestroy {
  combo: Combo;
  private comboSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private comboService: ComboService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private ticketService: TicketService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('comboId')) {
        this.navCtrl.navigateBack('/tabs/tab1');
        return;
      }
      this.comboSub = this.comboService.getCombo(paramMap.get('comboId')).subscribe(combo => {
        this.combo = combo;
      });
    });
  }

  onBookCombo() {
    this.modalCtrl
    .create({
      component: BookingsComponent,
      componentProps: { selectedCombo: this.combo }
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        this.loadingCtrl
          .create({
            message: 'Booking place...'
          })
          .then(loadingEl => {
            loadingEl.present();
            const data = resultData.data.bookingData;
            this.ticketService.addTicket(
              this.combo.id,
              this.combo.title,
              this.combo.imgUrl,
              this.combo.rate,
              this.combo.startDest,
              data.name,
              data.phoneNumber,
              data.email,
              data.note,
              data.coupon,
              data.startDate,
              data.numOfTickets
            );
            loadingEl.dismiss();
          });
        }
    });
  }

  ngOnDestroy() {
    if (this.comboSub) {
      this.comboSub.unsubscribe();
    }
  }
}
