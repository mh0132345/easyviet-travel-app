import { Component, OnInit, OnDestroy } from '@angular/core';
import { Combo } from './combo.model';
import { ComboService } from './combo.service';
import { Article } from './article.model';
import { ArticleService } from './article.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  loadedCombos: Combo[] = [];
  loadedArticles: Article[] = [];
  private combosSub: Subscription;
  private articlesSub: Subscription;

  constructor(
    private comboService: ComboService,
    private articleService: ArticleService,
  ) {}

  ngOnInit() {
    this.combosSub = this.comboService.combos.subscribe(combos => {
      this.loadedCombos = combos;
    });

    this.articlesSub = this.articleService.articles.subscribe(articles => {
      this.loadedArticles = articles;
    });
  }

  ngOnDestroy() {
    if (this.combosSub) {
      this.combosSub.unsubscribe();
    }
    if (this.articlesSub) {
      this.articlesSub.unsubscribe();
    }
  }
}
