import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarComponentOptions, CalendarModalOptions } from 'ion2-calendar';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

  @ViewChild('signupSlider', {static: true}) signupSlider;

  public slideOneForm: FormGroup;
  public slideTwoForm: FormGroup;
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
  constructor(public formBuilder: FormBuilder) {
    this.slideOneForm = formBuilder.group({
      firstName: [''],
      phoneNumber: [''],
      email: [''],
      note: [''],
      coupon: [''],
      numOfTickets: [''],
    });

    this.slideTwoForm = formBuilder.group({
      cardName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvc: [''],
      saveCard: [''],
    });
  }

  ngOnInit() {
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

  onChange($event) {
    console.log($event);
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
  }
}
