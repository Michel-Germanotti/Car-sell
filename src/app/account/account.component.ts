import { AuthService } from './../services/auth.service';
import { User } from './../interfaces/user';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  currentUserSubscription!: Subscription;
  currentUser!: User;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initoCurrentUser();
  }

  initoCurrentUser(): void {
    // je souscris à l'utilisateur (authService)
    this.currentUserSubscription = this.authService.currentUserSubject.subscribe({
      next: user => this.currentUser = <User>user,
      error: console.error
    })
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

}
