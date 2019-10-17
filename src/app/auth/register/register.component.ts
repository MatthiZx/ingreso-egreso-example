import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppState } from 'src/app/shared/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  cargando: boolean;
  subscription: Subscription;

  constructor( public authService: AuthService,
               public store: Store<AppState> ) { }

  ngOnInit() {
    this.store.select('ui')
    .subscribe( ui => this.cargando = ui.isLoading )
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onSubmit( data: any){
    console.log( data );
    this.authService.crearUsuario(data.nombre, data.email , data.password);
  }

}
