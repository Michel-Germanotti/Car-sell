import { OffersService } from './../services/offers.service';
import { Offer } from './../interfaces/offer';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  offersSubscription!: Subscription;
  offers: Offer[] = [];

  constructor(
    private router: Router,
    private offerService : OffersService
  ) { }

  ngOnInit(): void {
    this.initOffers();
  }

  initOffers(): void {
    this.offersSubscription = this.offerService.offersSubject.subscribe({
      next: offers => this.offers = offers,
      error: console.error
    });
    this.offerService.getOffers();
  }

  ngOnDestroy(): void {
    this.offersSubscription.unsubscribe();
  }

}
