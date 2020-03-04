import { Injectable } from '@angular/core';
import { Article } from './article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private _articles: Article[] = [
    new Article(
      '1',
      'Ngắm ruộng bậc thang Sapa',
      'https://tour.dulichvietnam.com.vn/uploads/tour/1554713265_tour-ha-long-3.jpg',
    ),
    new Article(
      '2',
      'Ngắm Đà Lạt',
      'https://tour.dulichvietnam.com.vn/uploads/tour/1554713265_tour-ha-long-3.jpg',
    ),
    new Article(
      '3',
      'Corona Vũ Hán',
      'https://tour.dulichvietnam.com.vn/uploads/tour/1554713265_tour-ha-long-3.jpg',
    )
  ];

  constructor() { }

  get articles() {
    return [...this._articles];
  }
}
