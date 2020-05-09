import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from '../article.model';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../article.service';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.page.html',
  styleUrls: ['./article-detail.page.scss'],
})
export class ArticleDetailPage implements OnInit, OnDestroy {
  article: Article;
  private articleSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private articleService: ArticleService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('articleId')) {
        this.navCtrl.navigateBack('/tabs/tab1');
        return;
      }
      this.articleSub = this.articleService.getArticle(paramMap.get('articleId')).subscribe(article => {
        this.article = article;
      });
    });
  }

  ngOnDestroy() {
    this.articleSub.unsubscribe();
  }
}
