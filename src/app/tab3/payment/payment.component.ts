import { Component, OnInit, Input } from '@angular/core';
import { AlertController, Platform, ModalController } from '@ionic/angular';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  @Input() discount: number;
  @Input() price: number;
  @Input() quantity: number;

  public payPalConfig?: IPayPalConfig;
  public isPlatformBrowser: boolean;
  public totalPrice: number;

  currencyConvertRate = 0.000043;
  currency = 'USD';

  stepTitle: string;
  paymentTitle: string;
  totalPriceTitle: string;
  failMessage: string;
  errorMessage: string;

  constructor(
    private modalCtrl: ModalController,
    private payPal: PayPal,
    private translateService: TranslateService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.totalPrice = this.price * this.quantity - this.discount;
    this.initConfig(this.price);
  }

  onBookCombo() {
    this.modalCtrl.dismiss(
      {},
      'confirm'
    );
  }

  prev() {
    this.modalCtrl.dismiss(
      {},
      'back'
    );
  }

  payWithPaypal() {
    const sandBoxClientId = 'AU2oJ_5sjp1cSi5NmPRCN5JhizNgrxw6vTXQxa0fGFH73WVgsfjDs_eBC_HAmJ7lDS6wT5E1nzgvMIbF';
    const totalPrice = this.price * this.quantity * this.currencyConvertRate;
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
          if (res.response.state === 'approved') {
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
          this.presentAlert(this.failMessage, this.errorMessage);
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

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private initConfig(price: number) {
    const sandBoxClientId = 'AU2oJ_5sjp1cSi5NmPRCN5JhizNgrxw6vTXQxa0fGFH73WVgsfjDs_eBC_HAmJ7lDS6wT5E1nzgvMIbF';
    const totalPrice = price * this.quantity * this.currencyConvertRate;
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
                quantity: this.quantity.toString(),
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

  ionViewDidEnter() {
    this._initialiseTranslation();
  }

  _initialiseTranslation(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.stepTitle = this.translateService.instant('STEP');
      this.paymentTitle = this.translateService.instant('PAYMENT');
      this.totalPriceTitle = this.translateService.instant('TOTAL');
      this.failMessage = this.translateService.instant('FAIL');
      this.errorMessage = this.translateService.instant('ERRORMESSAGE');
    });
    this.translateService.get('STEP').subscribe((res: string) => {
      this.stepTitle = res;
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
    this.translateService.get('ERRORMESSAGE').subscribe((res: string) => {
      this.errorMessage = res;
    });
  }
}
