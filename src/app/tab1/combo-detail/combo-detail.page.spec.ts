import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComboDetailPage } from './combo-detail.page';

describe('ComboDetailPage', () => {
  let component: ComboDetailPage;
  let fixture: ComponentFixture<ComboDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComboDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
