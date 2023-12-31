import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/login/login.component';
import { SignupComponent } from 'src/app/signup/signup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  constructor(public dialog: MatDialog){}

  ngOnInit(): void {  
  }

  signupAction(){
    if(!this.dialog.openDialogs.length){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '550px';
      dialogConfig.panelClass = 'custom-dialog-container';
      this.dialog.open(SignupComponent, dialogConfig);
    }
  }
  loginAction(){
    if (!this.dialog.openDialogs.length){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '550px';
      dialogConfig.panelClass = 'custom-dialog-container';
      this.dialog.open(LoginComponent, dialogConfig);
    }
  }
}
