import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Offer } from './../interfaces/offer';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  private offers: Offer[] = [];

  // Observable + Observateur <-->
  offersSubject: BehaviorSubject<Offer[]> = new BehaviorSubject(<Offer[]>[]);

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {
    this.getOffersOn();
   }

  getOffers(): void {
    this.db.list('offers').query.limitToLast(10).once('value', snapshot => {
      const offersSnapshotValue = snapshot.val();
      // si firebase renvoi null
      if (offersSnapshotValue) {
        // on convertir l'id de la bdd en id/index de tableau
        const offers = Object.keys(offersSnapshotValue).map(id => ({id, ...offersSnapshotValue[id]}));
        this.offers = offers;
      }

      // emmettre le nouvel état
      this.dispatchOffers();
    })
  }

  // ---- option
          // écoute des MAJ
    getOffersOn(): void{
      // ouverture du flux entre l'app et firebase (.on)
      this.db.list('offers').query.limitToLast(10).on('value', snapshot => {
        const offersSnapshotValue = snapshot.val();
        // on convertir l'id de la bdd en id/index de tableau
        const offers = Object.keys(offersSnapshotValue).map(id => ({id, ...offersSnapshotValue[id]}));
        console.log(offers);
      })
    }
  // ----- option

    getOfferById(offerId: string): Promise<Offer> {
      return new Promise((resolve, reject) => {
        // je veux récup la valeur une seule fois, sans écoute
        this.db.database.ref(`offers/${offerId}`).once('value', (snapshot, err) => {
          if(err) {
            reject(err);
          }
          resolve(snapshot.val());
        })
      })
    }

  dispatchOffers(){
    this.offersSubject.next(this.offers);
  }

  async createOffer(offer: Offer, offerPhoto?: any): Promise<Offer>{

    try {
      // s'il y a une photo
      const photoURL = offerPhoto ? await this.uploadPhoto(offerPhoto) : '';
      // on ajoute l'offre à la bdd
      const response = this.db.list('offers').push({...offer, photo: photoURL});
      // déconstruire l'offre + id type string imposé
      const createdOffer = {...offer, photo: photoURL, id: <string>response.key};
      this.offers.push(createdOffer);
      // emmettre le nouvel état
      this.dispatchOffers();
      return createdOffer;
    } catch (error) {
      throw error;
    }

  }

  async editOffer(offer: Offer, offerId: string, newOfferPhoto?: any): Promise<Offer>{

    try {
      if(newOfferPhoto && offer.photo && offer.photo !== '') {
        // je supprime l'ancienne photo
        await this.removePhoto(offer.photo)
      }
      // upload
      if (newOfferPhoto) {
        const newPhotoUrl = await this.uploadPhoto(newOfferPhoto);
        offer.photo = newPhotoUrl;
      }
      // MAJ
      await this.db.list('offers').update(offerId, offer);
      // récupère l'élément correspondant à l'id modifié
      const offerIndexToUpdate = this.offers.findIndex(el => el.id === offerId);
      this.offers[offerIndexToUpdate] = {...offer, id: offerId};
      this.dispatchOffers();
      return {...offer, id: offerId};
    } catch (error) {
      throw error
    }
  }

  async deleteOffer(offerId: string): Promise<Offer> {

    try {
      const offerToDeleteIndex = this.offers.findIndex(el => el.id === offerId);
      const offerToDelete = this.offers[offerToDeleteIndex];
      if (offerToDelete.photo && offerToDelete.photo !== '') {
        await this.removePhoto(offerToDelete.photo)
      }
      await this.db.list('offers').remove(offerId);
      this.offers.splice(offerToDeleteIndex, 1);
      this.dispatchOffers();
      return offerToDelete;
    } catch (error) {
      throw error;
    }

  }

  // envoi photo
  private uploadPhoto(photo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = this.storage.upload('offers/' + Date.now() + '-' + photo.name, photo);
      upload.then((res) => {
        resolve(res.ref.getDownloadURL());
      }).catch(reject);
    });
  }

  // supprimer photo
  private removePhoto(photoURL: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // 106 <->
      this.storage.refFromURL(photoURL).delete().subscribe({
        complete: () => resolve({}),
        error: reject
      })
    });
  }
}
