import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { User } from './../../interfaces/user';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-auth-infos',
  templateUrl: './edit-auth-infos.component.html',
  styleUrls: ['./edit-auth-infos.component.scss']
})
export class EditAuthInfosComponent implements OnInit {

  @Input() currentUser!: User;

  passwordForm!: FormGroup;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private authService : AuthService
  ) { }

  ngOnInit(): void {
    this.initPasswordForm();
  }

  initPasswordForm(): void {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPasswordConfirm: ['', [Validators.required]]
    })
  }

  onEditPassword(modal: any): void{
    this.modalService.open(modal, { centered: true });
  }

  onSubmitPasswordForm(): void {
    this.authService.signinUser(<string>this.currentUser.email, this.passwordForm.value.oldPassword)
    .then(() => {
      this.currentUser.updatePassword(this.passwordForm.value.newPassword)
      .then(() => {
        this.passwordForm.reset();
        this.modalService.dismissAll()
      }).catch(console.error);
    }).catch(console.error);
  }
}
