import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Combo } from '../combo.model';
import { ComboService } from '../combo.service';

@Component({
  selector: 'app-combo-detail',
  templateUrl: './combo-detail.page.html',
  styleUrls: ['./combo-detail.page.scss'],
})
export class ComboDetailPage implements OnInit {
  combo: Combo;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private comboService: ComboService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('comboId')) {
        this.navCtrl.navigateBack('/tabs/tab1');
        return;
      }
      this.combo = this.comboService.getCombo(paramMap.get('comboId'));
    });
  }

}
