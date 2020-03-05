import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab1Page } from './tab1.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
  },
  {
    path: 'article-detail/:articleId',
    loadChildren: () => import('./article-detail/article-detail.module').then( m => m.ArticleDetailPageModule)
  },
  {
    path: 'combo-detail/:comboId',
    loadChildren: () => import('./combo-detail/combo-detail.module').then( m => m.ComboDetailPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
