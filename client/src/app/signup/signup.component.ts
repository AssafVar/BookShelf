import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalContants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: any = FormGroup;
  responseMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalContants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalContants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalContants.contactNumberRegex)]],
      password: [null, [Validators.required]],
    });
  }
  
  handleSubmit() {
    this.ngService.start();
    const formData = this.signupForm.value;
    const data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
    }
    this.userService.signup(data).subscribe({
      next: (response: any) => {
        this.ngService.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackbar(this.responseMessage, '');
        this.router.navigate(['']);
      },
      error: (error) => {
        this.ngService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalContants.genericError;
        }
        this.snackbarService.openSnackbar(this.responseMessage, GlobalContants.error);
      },

    })

  }

}
