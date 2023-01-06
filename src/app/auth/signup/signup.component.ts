import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initSignupForm();
  }

  initSignupForm(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required]],
      cguCheck: [false, [Validators.requiredTrue]]
    });
  }

  onSubmitSignupForm() {
    this.authService.signupUser(this.signupForm.value.email, this.signupForm.value.password)
    .then(user => {
      console.log(user);
      // Rediriger l'user
      this.router.navigate(['/admin', 'dashboard']);
    }).catch(console.error);
  }
}
