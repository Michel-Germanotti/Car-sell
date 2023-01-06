import { User } from './../interfaces/user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  currentUserSubject = new BehaviorSubject<User | null>(null)

  constructor(
    private auth: AngularFireAuth
  ) {
    // vérifie le status d'auth user
    this.auth.onAuthStateChanged(user => {
      // emet vers l'observable
      this.currentUserSubject.next(user);
    }, console.error);
   }

  // Inscription
  signupUser(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        resolve(user);
      }).catch(reject);
    });
  }

  // Connexion
  signinUser(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password).then(resolve).catch(reject);
    })
  }

  // Déceonnexion
  signoutUser(): Promise<void>{
    return new Promise((resolve, reject) => {
      this.auth.signOut().then(() =>{
        this.currentUserSubject.next(null);
        resolve();
      }).catch(reject)
    });
  }

  //
  sendPasswordResetEmail(email: string): Promise<void>{
    return new Promise((resolve, reject) => {
      this.auth.sendPasswordResetEmail(email).then(resolve).catch(reject);
    })
  }

}
