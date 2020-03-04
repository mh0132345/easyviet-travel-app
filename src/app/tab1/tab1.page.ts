import { Component, OnInit } from '@angular/core';
import { Combo } from './combo.model';
import { ComboService } from './combo.service';
import { Article } from './article.model';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  loadedCombos: Combo[] = [];
  loadedArticles: Article[] = [];

  constructor(
    private comboService: ComboService,
    private articleService: ArticleService,
  ) {}

  ngOnInit() {
    this.loadedCombos = this.comboService.combos;
    this.loadedArticles = this.articleService.articles;
  }
}
