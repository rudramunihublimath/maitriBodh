import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegistrationComponent } from 'src/app/credComponent/registration/registration.component';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { UserReq, UserTableDto } from 'src/app/types';


@Component({
  selector: 'app-user-table-view',
  templateUrl: './user-table-view.component.html',
  styleUrls: ['./user-table-view.component.scss']
})


export class UserTableViewComponent implements OnInit {
  displayedColumns = ['position', 'firstname', 'lastname', 'email', 'actions'];
  displayFilterColumns = ['positionFilter', 'firstnameFilter', 'lastnameFilter', 'emailFilter', 'actionFilter']
  dataSource: UserTableDto[] = [];
  allUsersDetail: UserTableDto[] = [];
  loggedInUserDetails: any = null;

  firstNameControl = new FormControl('');
  lastNameControl = new FormControl('');
  emailControl = new FormControl(''); 

  isAuthorized = false;
  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';

    this.getAllUsersById(this.loggedInUserDetails.email); 
    this.searchUserByFirstName();
    this.searchUserByLastName();
    this.searchUserByEmail();
  }


  getAllUsersById(emailId: string) {
    this.spinner.show();
    this.userService.getAllUsersById(emailId).subscribe((resp: Array<UserTableDto>) => {
      this.dataSource = resp;
      this.allUsersDetail = resp;
      this.spinner.hide();
    })
  }

  addNewMember() {
    const config = new MatDialogConfig(); 
    config.width= "75vw";
    config.disableClose=true;
    const dialog = this.dialog.open(RegistrationComponent, config);

    dialog.afterClosed().subscribe(resp => {
      this.getAllUsersById(this.loggedInUserDetails.email);
    })

  }

  searchUserByFirstName() {
    this.firstNameControl.valueChanges.subscribe(val => {
      this.dataSource = val ? this.allUsersDetail.filter(usr => usr.firstname.toLowerCase().includes(val.toLowerCase())) : this.allUsersDetail;
    })
  }

  searchUserByLastName() {
    this.lastNameControl.valueChanges.subscribe(val => {
      this.dataSource = val ? this.allUsersDetail.filter(usr => usr.lastname.toLowerCase().includes(val.toLowerCase())) : this.allUsersDetail;
    })
  }

  searchUserByEmail() {
    this.emailControl.valueChanges.subscribe(val => {
      this.dataSource = val ? this.allUsersDetail.filter(usr => usr.email.toLowerCase().includes(val.toLowerCase())) : this.allUsersDetail;
    })
  }

  navigateToUserDetails(email: string) {
    this.router.navigate(['/user-profile'], {queryParams: {email}});
    // this.userService.emitEmail.next(email);
  }

  // getUserByEmail(email: string) {
  //   this.spinner.show();
  //   this.userService.getUserByEmail(email).subscribe((resp: UserReq) => {
  //     this.userDetail = resp;
  //     console.log('this.userDetail', this.userDetail)
  //     this.spinner.hide();
  //   })
  // }
}
