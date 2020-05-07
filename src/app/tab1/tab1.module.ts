import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ArticleDetailPageModule } from './article-detail/article-detail.module';
import { SearchPageComponent } from './search-page/search-page.component';
import { StarRatingModule } from 'ionic5-star-rating';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    ArticleDetailPageModule,
    StarRatingModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [Tab1Page, SearchPageComponent],
  entryComponents: [SearchPageComponent]
})
export class Tab1PageModule {}
