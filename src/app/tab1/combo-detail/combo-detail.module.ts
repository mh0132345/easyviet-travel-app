import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComboDetailPageRoutingModule } from './combo-detail-routing.module';

import { ComboDetailPage } from './combo-detail.page';
import { BookingsComponent } from 'src/app/tab3/bookings/bookings.component';
import { CalendarModule } from 'ion2-calendar';
import { StarRatingModule } from 'ionic5-star-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    StarRatingModule,
    ComboDetailPageRoutingModule,
    CalendarModule,
  ],
  declarations: [ComboDetailPage, BookingsComponent],
  entryComponents: [BookingsComponent]
})
export class ComboDetailPageModule {}
