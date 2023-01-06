import { OffersService } from './../../services/offers.service';
import { Offer } from './../../interfaces/offer';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // le formulaire
  offerForm!: FormGroup;

  // les données
  offers: Offer[] = [];

  subscription!: Subscription;

  currentOfferPhotoFile!: any;
  currentOfferPhotoURL!: string;

  constructor(
    private formBuilder: FormBuilder,
    private offersService: OffersService
    ) {
  }

  ngOnInit(): void {
    this.initOfferForm();
    // On souscrit et récupère les offres
    this.subscription = this.offersService.offersSubject.subscribe({
      next: (offers: Offer[]) => {
        this.offers = offers;
        console.log('NEXT');
      },
      error: (error) => { console.error(error); }
    });
    this.offersService.getOffers();
  }

  // On initialise le formulaire
  initOfferForm(): void {
    this.offerForm = this.formBuilder.group({
      id: [null],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      photo: [],
      brand: '',
      model: '',
      description: '',
      price: 0
    });
  }

  // envoi du formulaire
  onSubmitOfferForm(): void {
    // Je récup l'index
    const offerId = this.offerForm.value.id;
    // La valeur de l'offre
    let offer = this.offerForm.value;
    const offerPhotoUrl = this.offers.find(el => el.id === offerId)?.photo;
    offer = {...offer, photo: offerPhotoUrl};
    // je vérifie que l'id existe
    // CRÉATION
    if(!offerId || offerId && offerId === '') {
      // je supprime l'id du formulaire
      delete offer.id;
      // Push les innformations du formulaire dans offers[]
      this.offersService.createOffer(offer, this.currentOfferPhotoFile).catch(console.error);
    } else { // MODIFICATION
      // je supprime l'id du formulaire
      delete offer.id;
      // dans le tableau offers, je récupère les valeurs de la position id
      // puis j'insère insère offer à la place
      this.offersService.editOffer(offer, offerId, this.currentOfferPhotoFile).catch(console.error);
    }
    // On réinitialise le formulaire
    // this.offerForm.reset();
    this.initOfferForm();
    this.currentOfferPhotoFile = null;
    this.currentOfferPhotoURL = '';
  }

  // détecter l'envoi d'une image
  onChangeOfferPhoto($event: any): void {
    this.currentOfferPhotoFile = $event.target.files[0];
    // lire le fichier
    const fileReader = new FileReader();
    // extraire l'URL
    fileReader.readAsDataURL(this.currentOfferPhotoFile);
    // lorsqu'il a fini on récup l'évènement
    fileReader.onloadend = (e) => {
      // on récup le res dans currentOfferPhotoURL, tkt ça sera une string
      this.currentOfferPhotoURL = <string>e.target?.result;
    }
  }

  // modifier une l'offre
  onEditOffer(offer: Offer): void {
    // On envoi les valeurs du tableau dans le formulaire
    // ... on ajoute l'id
    console.log(offer);
    console.log(this.offerForm);
    this.currentOfferPhotoURL = offer.photo ? offer.photo : '';
    this.offerForm.setValue({
      id: offer.id ? offer.id : '',
      title: offer.title ? offer.title : '',
      photo: '',
      brand: offer.brand ? offer.brand : '',
      model: offer.model ? offer.model : '',
      description: offer.description ? offer.description : '',
      price: offer.price ? offer.price : 0,
    });

  }

  // supprimer une offre
  onDeleteOffer(offerId?: string): void {
    if(offerId) {
      this.offersService.deleteOffer(offerId).catch(console.error);
    } else {
      console.error('An id must be provided to delete an offer');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
