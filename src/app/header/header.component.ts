import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { User } from './../interfaces/user';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  currentUserSubscription!: Subscription;
  currentUser!: User;

  title = "Carsell";

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.authService.currentUserSubject.subscribe({
      next: user => this.currentUser = <User>user,
      error: console.error
    })
  }

  getTitle() {
    return this.title;
  }

  onSignout(): void {
    this.authService.signoutUser()
    .then(() => {
      this.router.navigate(['/home']);
    }).catch(console.error);
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

}
