import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Combo } from '../combo.model';
import { ComboService } from '../combo.service';
import { TicketService } from 'src/app/tab3/ticket.service';
import { BookingsComponent } from 'src/app/tab3/bookings/bookings.component';
import { Subscription } from 'rxjs';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from 'ion2-calendar';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-combo-detail',
  templateUrl: './combo-detail.page.html',
  styleUrls: ['./combo-detail.page.scss'],
})
export class ComboDetailPage implements OnInit, OnDestroy {
  combo: Combo;
  private comboSub: Subscription;
  public availableDay: string;

  freeWifiTitle: string;
  hotelTitle: string;
  breakfastTitle: string;
  taxiTitle: string;
  introTitle: string;
  offerTitle: string;
  bookButtonTitle: string;
  starTitle: string;
  waitMessage: string;
  everyWeek: string;
  departDateTitle: string;
  continueButtonTitle: string;
  cancelButtonTitle: string;
  from: string;

  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private comboService: ComboService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private ticketService: TicketService,
    private translateService: TranslateService,
    private router: Router,
  ) {
    this.translateService.get('MON').subscribe((res: string) => {
      this.mon = res;
    });
    this.translateService.get('TUE').subscribe((res: string) => {
      this.tue = res;
    });
    this.translateService.get('WED').subscribe((res: string) => {
      this.wed = res;
    });
    this.translateService.get('THU').subscribe((res: string) => {
      this.thu = res;
    });
    this.translateService.get('FRI').subscribe((res: string) => {
      this.fri = res;
    });
    this.translateService.get('SAT').subscribe((res: string) => {
      this.sat = res;
    });
    this.translateService.get('SUN').subscribe((res: string) => {
      this.sun = res;
    });
    this.translateService.get('EVERYWEEK').subscribe((res: string) => {
      this.everyWeek = res;
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('comboId')) {
        this.navCtrl.navigateBack('/tabs/tab1');
        return;
      }
      this.comboSub = this.comboService.getCombo(paramMap.get('comboId')).subscribe(combo => {
        this.combo = combo;
        const daysOfWeek = {
          mon: this.mon,
          tue: this.tue,
          wed: this.wed,
          thu: this.thu,
          fri: this.fri,
          sat: this.sat,
          sun: this.sun,
        };
        this.availableDay = '';
        for (const day in this.combo.availableWeek) {
          if (this.combo.availableWeek.hasOwnProperty(day)) {
            if (this.combo.availableWeek[day]) {
              this.availableDay += daysOfWeek[day] + ' ';
            }
          }
        }
        this.availableDay += this.everyWeek;
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
      title: this.departDateTitle,
      from: new Date(),
      to: new Date(new Date().getTime() + 2 * 30 * 24 * 3600 * 1000), // 2 months from Today
      disableWeeks,
      monthFormat: 'MM/YYYY',
      doneLabel: this.continueButtonTitle,
      closeLabel: this.cancelButtonTitle
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
              message: this.waitMessage
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
              this.router.navigateByUrl('/success');
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

  ionViewWillEnter() {
    this._initialiseTranslation();
  }

  _initialiseTranslation(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.freeWifiTitle = this.translateService.instant('FREEWIFI');
      this.hotelTitle = this.translateService.instant('HOTEL');
      this.breakfastTitle = this.translateService.instant('BREAKFAST');
      this.introTitle = this.translateService.instant('INTRODUCTION');
      this.offerTitle = this.translateService.instant('OFFER');
      this.bookButtonTitle = this.translateService.instant('BOOK');
      this.starTitle = this.translateService.instant('STAR');
      this.mon = this.translateService.instant('MON');
      this.tue = this.translateService.instant('TUE');
      this.wed = this.translateService.instant('WED');
      this.thu = this.translateService.instant('THU');
      this.fri = this.translateService.instant('FRI');
      this.sat = this.translateService.instant('SAT');
      this.sun = this.translateService.instant('SUN');
      this.everyWeek = this.translateService.instant('EVERYWEEK');
      this.departDateTitle = this.translateService.instant('DEPARTDATE');
      this.continueButtonTitle = this.translateService.instant('CONTINUE');
      this.cancelButtonTitle = this.translateService.instant('CANCEL');
      this.from = this.translateService.instant('FROM');
      this.taxiTitle = this.translateService.instant('TAXI');
    });
    this.translateService.get('FREEWIFI').subscribe((res: string) => {
      this.freeWifiTitle = res;
    });
    this.translateService.get('HOTEL').subscribe((res: string) => {
      this.hotelTitle = res;
    });
    this.translateService.get('BREAKFAST').subscribe((res: string) => {
      this.breakfastTitle = res;
    });
    this.translateService.get('INTRODUCTION').subscribe((res: string) => {
      this.introTitle = res;
    });
    this.translateService.get('OFFER').subscribe((res: string) => {
      this.offerTitle = res;
    });
    this.translateService.get('BOOK').subscribe((res: string) => {
      this.bookButtonTitle = res;
    });
    this.translateService.get('STAR').subscribe((res: string) => {
      this.starTitle = res;
    });
    this.translateService.get('WAIT').subscribe((res: string) => {
      this.waitMessage = res;
    });
    this.translateService.get('DEPARTDATE').subscribe((res: string) => {
      this.departDateTitle = res;
    });
    this.translateService.get('CONTINUE').subscribe((res: string) => {
      this.continueButtonTitle = res;
    });
    this.translateService.get('CANCEL').subscribe((res: string) => {
      this.cancelButtonTitle = res;
    });
    this.translateService.get('FROM').subscribe((res: string) => {
      this.from = res;
    });
    this.translateService.get('TAXI').subscribe((res: string) => {
      this.taxiTitle = res;
    });
  }
}
