import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, IonSlides, Platform, AlertController } from '@ionic/angular';
import { Combo } from '../../tab1/combo.model';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  @Input() selectedCombo: Combo;
  @ViewChild('bookingSlider', {static: true}) bookingSlider: IonSlides;
  public payPalConfig?: IPayPalConfig;
  public isPlatformBrowser: boolean;

  public slideOneForm: FormGroup;
  viewEntered = false;

  public useCoupon = false;
  public saveCard = true;
  public numOfTickets = 1;
  disabledButton = this.numOfTickets <= 1;

  public submitAttempt = false;
  startDate: Date;

  totalPrice = 0;
  discount = 0;
  currencyConvertRate = 0.000043;
  currency = 'USD';
  currencyIcon = '$';

  stepTitle: string;
  invalidFormNotice: string;
  infoTitle: string;
  customerNameTitle: string;
  noteFieldTitle: string;
  couponFieldTitle: string;
  numTicketFieldTitle: string;
  paymentTitle: string;
  totalPriceTitle: string;
  failMessage: string;
  errorMessage: string;
  continueButtonTitle: string;
  inputCouponTitle: string;

  constructor(
    private modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private translateService: TranslateService,
    private platform: Platform,
    private alertController: AlertController,
  ) {
    this.slideOneForm = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      phoneNumber: [''],
      email: ['', Validators.compose([
          Validators.maxLength(100),
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
          Validators.required
        ])
      ],
      note: [''],
      coupon: [''],
    });
  }

  ngOnInit() {
    if (this.platform.is('cordova')) {
      this.isPlatformBrowser = false;
    } else {
      this.isPlatformBrowser = true;
    }
  }

  ionViewDidEnter() {
    this.viewEntered = true;
    this._initialiseTranslation();
  }

  toogleCoupon() {
    this.useCoupon = !this.useCoupon;
  }

  toogleSaveCard() {
    this.saveCard = !this.saveCard;
  }

  next() {
    this.bookingSlider.slideNext();
  }

  prev() {
    this.submitAttempt = false;
    this.bookingSlider.getActiveIndex().then(index => {
      if (index !== 0) {
        this.bookingSlider.slidePrev();
      } else {
        this.modalCtrl.dismiss();
      }
    });
  }

  increaseNumTickets() {
    this.numOfTickets += 1;
    this.disabledButton = this.numOfTickets <= 1;
  }

  decreaseNumTickets() {
    this.numOfTickets -= 1;
    this.disabledButton = this.numOfTickets <= 1;
  }

  save() {
    this.submitAttempt = true;

    if (!this.slideOneForm.valid) {
        this.bookingSlider.slideTo(0);
    } else {
        this.next();
    }
  }

  onBookCombo() {
    this.modalCtrl.dismiss(
      {
        bookingData: {
          name: this.slideOneForm.value.name,
          phoneNumber: this.slideOneForm.value.phoneNumber,
          email: this.slideOneForm.value.email,
          note: this.slideOneForm.value.note,
          coupon: this.slideOneForm.value.coupon,
          numOfTickets: this.numOfTickets,
        }
      },
      'confirm'
    );
  }

  onSavingCustomerInfo() {
    this.save();
    this.discount = 0;
    if (this.selectedCombo.coupon[this.slideOneForm.value.coupon]) {
      this.discount = this.selectedCombo.coupon[this.slideOneForm.value.coupon];
    }
    this.totalPrice = this.selectedCombo.price * this.numOfTickets - this.discount;
    this.initConfig(this.selectedCombo.price);
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private initConfig(price: number): void {
    const sandBoxClientId = 'AU2oJ_5sjp1cSi5NmPRCN5JhizNgrxw6vTXQxa0fGFH73WVgsfjDs_eBC_HAmJ7lDS6wT5E1nzgvMIbF';
    const totalPrice = price * this.numOfTickets * this.currencyConvertRate;
    const itemPrice = price * this.currencyConvertRate;
    const discount = this.discount * this.currencyConvertRate;
    this.payPalConfig = {
      currency: 'USD',
      clientId: sandBoxClientId,
      // tslint:disable-next-line: no-angle-bracket-type-assertion
      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: totalPrice.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: totalPrice.toFixed(2)
                },
                discount: {
                  currency_code: 'USD',
                  value: discount.toFixed(2)
                }
              }
            },
            items: [
              {
                name: 'Travel combo',
                quantity: this.numOfTickets.toString(),
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'USD',
                  value: itemPrice.toFixed(2),
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: () => {
        this.onBookCombo();
      },
      onCancel: () => {
        this.presentAlert(this.failMessage, this.errorMessage);
      },
      onError: err => {
        this.presentAlert(this.failMessage, err);
      },
    };
  }

  _initialiseTranslation(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.stepTitle = this.translateService.instant('STEP');
      this.invalidFormNotice = this.translateService.instant('INVALIDFORM');
      this.infoTitle = this.translateService.instant('INFO');
      this.customerNameTitle = this.translateService.instant('CUSTOMERNAME');
      this.noteFieldTitle = this.translateService.instant('NOTE');
      this.couponFieldTitle = this.translateService.instant('COUPON');
      this.numTicketFieldTitle = this.translateService.instant('NUMTICKETS');
      this.paymentTitle = this.translateService.instant('PAYMENT');
      this.totalPriceTitle = this.translateService.instant('TOTAL');
      this.failMessage = this.translateService.instant('FAIL');
      this.continueButtonTitle = this.translateService.instant('CONTINUE');
      this.inputCouponTitle = this.translateService.instant('INPUTCOUPON');
      this.errorMessage = this.translateService.instant('ERRORMESSAGE');
    });
    this.translateService.get('STEP').subscribe((res: string) => {
      this.stepTitle = res;
    });
    this.translateService.get('INVALIDFORM').subscribe((res: string) => {
      this.invalidFormNotice = res;
    });
    this.translateService.get('INFO').subscribe((res: string) => {
      this.infoTitle = res;
    });
    this.translateService.get('CUSTOMERNAME').subscribe((res: string) => {
      this.customerNameTitle = res;
    });
    this.translateService.get('NOTE').subscribe((res: string) => {
      this.noteFieldTitle = res;
    });
    this.translateService.get('COUPON').subscribe((res: string) => {
      this.couponFieldTitle = res;
    });
    this.translateService.get('NUMTICKETS').subscribe((res: string) => {
      this.numTicketFieldTitle = res;
    });
    this.translateService.get('PAYMENT').subscribe((res: string) => {
      this.paymentTitle = res;
    });
    this.translateService.get('TOTAL').subscribe((res: string) => {
      this.totalPriceTitle = res;
    });
    this.translateService.get('FAIL').subscribe((res: string) => {
      this.failMessage = res;
    });
    this.translateService.get('CONTINUE').subscribe((res: string) => {
      this.continueButtonTitle = res;
    });
    this.translateService.get('INPUTCOUPON').subscribe((res: string) => {
      this.inputCouponTitle = res;
    });
    this.translateService.get('ERRORMESSAGE').subscribe((res: string) => {
      this.errorMessage = res;
    });
  }
}
