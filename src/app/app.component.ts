import { UsersService } from 'src/app/services/users.service';
import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user$ = this.UsersService.currentUserProfile$;
  constructor(public authService: AuthenticationService, private router: Router, private UsersService: UsersService){

  }

  logout(){
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    })
  }
}
