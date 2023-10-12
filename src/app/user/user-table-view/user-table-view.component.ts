import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegistrationComponent } from 'src/app/credComponent/registration/registration.component';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { ResponseDto, UserReq, UserTableDto } from 'src/app/types';


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
  loggedInUserDetails!: UserReq;

  firstNameControl = new FormControl('');
  lastNameControl = new FormControl('');
  emailControl = new FormControl(''); 

  userFilterControl = new FormControl(''); 

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

    this.getAllUsersById(this.loggedInUserDetails?.id as number); 
    this.searchUser();
    // this.searchUserByFirstName();
    // this.searchUserByLastName();
    // this.searchUserByEmail();
  }


  getAllUsersById(id: number) {
    this.spinner.show();
    this.userService.getAllUsersById(id).subscribe((resp: UserTableDto[]) => {
      this.dataSource = resp.filter(elt => elt.id !== this.loggedInUserDetails.id);
      this.allUsersDetail = resp.filter(elt => elt.id !== this.loggedInUserDetails.id);
      this.spinner.hide();
    })
  }

  addNewMember() {
    const config = new MatDialogConfig(); 
    config.width= "75vw";
    config.disableClose=true;
    const dialog = this.dialog.open(RegistrationComponent, config);

    dialog.afterClosed().subscribe(resp => {
      if(resp) {
        this.getAllUsersById(this.loggedInUserDetails?.reportingmanagerId);
      }
    })

  }

  searchUser() {
    this.userFilterControl.valueChanges.subscribe(val => {
      this.dataSource = val ? this.allUsersDetail.filter(usr => usr.firstname.toLowerCase().includes(val.toLowerCase()) || usr.lastname.toLowerCase().includes(val.toLowerCase()) || usr.email.toLowerCase().includes(val.toLowerCase())) : this.allUsersDetail;
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
