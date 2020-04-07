import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarModalOptions } from 'ion2-calendar';
import { ModalController, IonSlides } from '@ionic/angular';
import { Combo } from '../../tab1/combo.model';
import { ComboService } from '../../tab1/combo.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  @Input() selectedCombo: Combo;
  @ViewChild('signupSlider', {static: true}) signupSlider: IonSlides;

  public slideOneForm: FormGroup;
  public slideTwoForm: FormGroup;
  viewEntered = false;

  public useCoupon = false;
  public saveCard = true;
  public numOfTickets = 1;
  disabledButton = this.numOfTickets <= 1;

  date: string;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  options: CalendarModalOptions = {
    from: new Date(),
    to: new Date(2020, 8, 5),
    disableWeeks: [0, 1, 2, 3, 5, 6],
    monthFormat: 'MM/YYYY',
    cssClass: 'my-class',
  };

  public submitAttempt = false;
  startDate: Date;
  constructor(
    private comboService: ComboService,
    private modalCtrl: ModalController,
    public formBuilder: FormBuilder,
  ) {
    this.slideOneForm = formBuilder.group({
      name: [''],
      phoneNumber: [''],
      email: [''],
      note: [''],
      coupon: [''],
    });

    this.slideTwoForm = formBuilder.group({
      cardName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvc: [''],
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
    this.signupSlider.slideNext();
  }

  prev() {
    this.signupSlider.slidePrev();
  }

  onSelected($event) {
    this.startDate = new Date($event.time);
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
        this.signupSlider.slideTo(0);
    } else if (!this.slideTwoForm.valid) {
        this.signupSlider.slideTo(1);
    } else {
        console.log('Success!');
        console.log(this.slideOneForm.value);
        console.log(this.slideTwoForm.value);
    }
    this.signupSlider.slideNext();
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
          startDate: this.startDate,
        }
      },
      'confirm'
    );
  }
}
