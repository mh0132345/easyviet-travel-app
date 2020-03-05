import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComboDetailPageRoutingModule } from './combo-detail-routing.module';

import { ComboDetailPage } from './combo-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComboDetailPageRoutingModule
  ],
  declarations: [ComboDetailPage]
})
export class ComboDetailPageModule {}
