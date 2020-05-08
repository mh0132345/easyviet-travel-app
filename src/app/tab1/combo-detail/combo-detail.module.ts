import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComboDetailPageRoutingModule } from './combo-detail-routing.module';
import { ComboDetailPage } from './combo-detail.page';
import { BookingsComponent } from 'src/app/tab3/bookings/bookings.component';
import { CalendarModule } from 'ion2-calendar';
import { StarRatingModule } from 'ionic5-star-rating';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    StarRatingModule,
    ComboDetailPageRoutingModule,
    CalendarModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [ComboDetailPage, BookingsComponent],
  entryComponents: [BookingsComponent]
})
export class ComboDetailPageModule {}
