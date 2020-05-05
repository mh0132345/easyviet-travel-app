import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Combo, AvailableWeek } from '../combo.model';
import { ComboService } from '../combo.service';
import { TicketService } from 'src/app/tab3/ticket.service';
import { BookingsComponent } from 'src/app/tab3/bookings/bookings.component';
import { Subscription } from 'rxjs';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from 'ion2-calendar';

@Component({
  selector: 'app-combo-detail',
  templateUrl: './combo-detail.page.html',
  styleUrls: ['./combo-detail.page.scss'],
})
export class ComboDetailPage implements OnInit, OnDestroy {
  combo: Combo;
  private comboSub: Subscription;
  public availableDay = '';

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
        const daysOfWeekEngViet = {
          mon: 'Thứ hai',
          tue: 'Thứ ba',
          wed: 'Thứ tư',
          thu: 'Thứ năm',
          fri: 'Thứ sáu',
          sat: 'Thứ bảy',
          sun: 'Chủ nhật',
        };
        for (const day in this.combo.availableWeek) {
          if (this.combo.availableWeek.hasOwnProperty(day)) {
            if (this.combo.availableWeek[day]) {
              this.availableDay += daysOfWeekEngViet[day] + ' ';
            }
          }
        }
        this.availableDay += 'hàng tuần';
      });
    });
  }

  async onBookCombo() {
    const disableWeeks = [];
    const daysOfWeek = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    };
    for (const day in this.combo.availableWeek) {
      if (this.combo.availableWeek.hasOwnProperty(day)) {
        if (!this.combo.availableWeek[day]) {
          disableWeeks.push(daysOfWeek[day]);
        }
      }
    }
    const options: CalendarModalOptions = {
      title: 'Chọn ngày khởi hành',
      from: new Date(),
      to: new Date(2020, 30, 7),
      disableWeeks,
      monthFormat: 'MM/YYYY',
      doneLabel: 'Tiếp tục',
      closeLabel: 'Quay lại'
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const startDate: CalendarResult = event.data;
    if (startDate) {
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
                startDate.dateObj,
                data.numOfTickets
              )
              .subscribe(() => {
                loadingEl.dismiss();
              });
            });
          }
      });
    }
  }

  ngOnDestroy() {
    if (this.comboSub) {
      this.comboSub.unsubscribe();
    }
  }
}
