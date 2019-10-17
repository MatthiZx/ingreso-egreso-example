import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import *as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../shared/app.reducer';

import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.accions';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();

  constructor( private afAuth: AngularFireAuth,
                private router:  Router,
                private afdb: AngularFirestore,
                private store: Store<AppState>) { 

  }

  initAuthListener(){

    this.afAuth.authState.subscribe( (fbUser: firebase.User) =>{

      if ( fbUser ){
        this.userSubscription = this.afdb.doc(`${ fbUser.uid }/usuario`).valueChanges()
        .subscribe( (usuarioObj: any) =>{

          const newUser = new User( usuarioObj );

          this.store.dispatch( new SetUserAction( newUser ) );

        });
      } else {
        this.userSubscription.unsubscribe();
      }

    })
  }

  crearUsuario( nombre: string, email: string, password: string ){
    
    this.store.dispatch( new ActivarLoadingAction() );

    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(
      resp =>{
        const user: User = {
          uid: resp.user.uid,
          nombre: nombre,
          email: resp.user.email
        }
        this.afdb.doc(`${ user.uid }/usuario`)
          .set( user)
          //en el set envio toda la informacion dentro 
          .then( () => {

            this.router.navigate(['/']);
            this.store.dispatch( new DesactivarLoadingAction() );

          });
        // console.log(resp);
        // this.router.navigate(['/']);
      })
      .catch( error =>{
        Swal.fire('Error en registro!', error.message, 'error');
        this.store.dispatch( new DesactivarLoadingAction() );
      })
  }

  login( email: string, password: string){

    this.store.dispatch( new ActivarLoadingAction() );

    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(
      resp =>{
        console.log(resp)
        this.store.dispatch( new DesactivarLoadingAction() );
        this.router.navigate(['/dashboard']);
      })
      .catch( error => {
        //console.error( error );
        this.store.dispatch( new DesactivarLoadingAction() );
        Swal.fire('Error en el login', error.message, 'error');
      })
  }

  logout(){
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  isAuth(){
    return this.afAuth.authState
    .pipe(
      map( fbUser =>{
        console.log("fbUser ", fbUser); 
        if( fbUser == null ){
          this.router.navigate(['/login']);
        }
       return fbUser != null})
    );
  }
}
