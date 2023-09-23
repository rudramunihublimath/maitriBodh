import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  login() {
    
      this.loginService.login(this.loginForm.value).subscribe((res: any) => {
        this.loginService.userToken(res?.jwtToken);
        this.loginService.setUserDetails(res);
        this.router.navigate(['/user-details'])

      },
      (err) => {
        this.loginService.openSnackBar('Please enter valid credentials', 'INVALID CREDENTIALS');
      })
  }

  openForgotPasswordDialog() {
    const config = new MatDialogConfig(); 
    config.width= "40vw";
    config.disableClose=true;
    config.data = {forgotPassword: true};
    const dialog = this.dialog.open(ForgotPasswordComponent, config);

    dialog.afterClosed().subscribe(resp => {
      // API CALL
    })
  }
}
