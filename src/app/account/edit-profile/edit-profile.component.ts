import { AuthService } from './../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from './../../interfaces/user';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnChanges {

  @Input() currentUser!: User;

  usernameForm!: FormGroup;
  emailForm!: FormGroup;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private authService : AuthService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['currentUser'].currentValue);
  }

  ngOnInit(): void {
    this.initUsernameForm();
    this.initEmailForm();
  }

  initUsernameForm(): void {
    // j'initialise le champs
    this.usernameForm = this.formBuilder.group({
      username: ['', [Validators.required]]
    });
  }

  initEmailForm(): void {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onEditUsername(modal: any): void {
        // j'insère la valeur dans le champs
        this.usernameForm.get('username')?.setValue(this.currentUser.displayName);
    // modal centré sur l'écran
    this.modalService.open(modal, { centered: true })
  }

  onEditEmail(modal: any): void {
    this.emailForm.get('email')?.setValue(this.currentUser.email);
    this.modalService.open(modal, {centered: true})
  }

  onSubmitUsernameForm(): void {
    this.currentUser.updateProfile({displayName: this.usernameForm.value.username})
    .then(() => {
      // quand MAJ, fais disparaitre les modals
      this.modalService.dismissAll();
    }).catch(console.error)
  }

  onSubmitEmailForm(): void {
    this.authService.signinUser(<string>this.currentUser.email, this.emailForm.value.password).then(() => {
      this.currentUser.updateEmail(this.emailForm.value.email)
      .then(() => {
        // quand MAJ, fais disparaitre les modals
        this.modalService.dismissAll();
        this.emailForm.reset();
      }).catch(console.error);
    }).catch(console.error);
  }
}
