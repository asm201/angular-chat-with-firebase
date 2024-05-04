import { AuthenticationService } from './../../services/authentication.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthenticationService, private router: Router, private toaster: HotToastService){}

  ngOnInit(): void {

  }

  get email(){
    return this.loginForm.get('email')
  }

  get password(){
    return this.loginForm.get('password')
  }

  submit() {
    if (!this.loginForm.valid){
      return;
    }

    const { email, password } = this.loginForm.value

    if(email == null || password == null){
      return;
    }

    this.authService.login(email, password).pipe(
      this.toaster.observe({
        success: 'logged in successfully',
        loading: 'loggin in',
        error: 'there was an error'
      })
    ).subscribe(() => {
      this.router.navigate(['\home'])
    })
  }
}
