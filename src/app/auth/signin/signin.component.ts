import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initSigninForm();
  }

  initSigninForm(): void {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  onSubmitSigninForm(): void {
    this.authService.signinUser(this.signinForm.value.email, this.signinForm.value.password)
    .then(() => {
      this.router.navigate(['/admin', 'dashboard']);
    }).catch(console.error);
  }

}
