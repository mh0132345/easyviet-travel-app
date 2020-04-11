import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.page.html',
  styleUrls: ['./account-info.page.scss'],
})
export class AccountInfoPage implements OnInit {
  currentUser: User;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
  }

}
