import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, IonSlides, ToastController } from '@ionic/angular';
import { Combo } from '../../tab1/combo.model';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  @Input() selectedCombo: Combo;
  @ViewChild('bookingSlider', {static: true}) bookingSlider: IonSlides;

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

  constructor(
    private modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private payPal: PayPal,
    private toastCtrl: ToastController,
  ) {
    this.slideOneForm = formBuilder.group({
      name: [''],
      phoneNumber: [''],
      email: [''],
      note: [''],
      coupon: [''],
    });
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.viewEntered = true;
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
        console.log('Success!');
        console.log(this.slideOneForm.value);
    }
    this.bookingSlider.slideNext();
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
    if (this.selectedCombo.coupon[this.slideOneForm.value.coupon]) {
      this.discount = this.selectedCombo.coupon[this.slideOneForm.value.coupon];
    }
    this.totalPrice = this.selectedCombo.price * this.numOfTickets - this.discount;
    this.next();
  }

  payWithPaypal() {
    const sandBoxClientId = 'AU2oJ_5sjp1cSi5NmPRCN5JhizNgrxw6vTXQxa0fGFH73WVgsfjDs_eBC_HAmJ7lDS6wT5E1nzgvMIbF';
    const totalPrice = this.totalPrice * this.currencyConvertRate;
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: sandBoxClientId
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        // payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        const payment = new PayPalPayment(totalPrice.toFixed(2), this.currency, 'Description', 'sale');
        console.log(payment);
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log(res);
          if (res.state === 'approved') {
            this.onBookCombo();
          }
          // Successfully paid

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          // Error or render dialog closed without being successful
          this.presentFailPayment();
        });
      }, () => {
        // Error in configuration
        console.log('Error in configuration');
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
      console.log('Error in initialization');
    });
  }

  async presentFailPayment() {
    const toast = await this.toastCtrl.create({
      message: 'Payment failed',
      duration: 2000
    });
    toast.present();
  }
}
