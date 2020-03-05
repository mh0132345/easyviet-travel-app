import { Injectable } from '@angular/core';
import { Article } from './article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private _articles: Article[] = [
    new Article(
      '1',
      'Ngắm ruộng bậc thang Sapa mùa lúa chín, cảnh đẹp Tây Bắc',
      // tslint:disable-next-line: max-line-length
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Halong_ensemble_%28colour_corrected%29.jpg/330px-Halong_ensemble_%28colour_corrected%29.jpg',
      'Nội dung về Sapa'
      ),
    new Article(
      '2',
      'Ngắm Đà Lạt',
      'https://tour.dulichvietnam.com.vn/uploads/tour/1554713265_tour-ha-long-3.jpg',
      'Nội dung về Sapa',
    ),
    new Article(
      '3',
      'Corona Vũ Hán',
      'https://tour.dulichvietnam.com.vn/uploads/tour/1554713265_tour-ha-long-3.jpg',
      'Nội dung về Sapa',
    )
  ];

  constructor() { }

  get articles() {
    return [...this._articles];
  }

  getArticle(id: string) {
    return {...this._articles.find(p => p.id === id)};
  }
}
