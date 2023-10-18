import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { OutReach, ResponseDto, SchoolDetail, SchoolTableDetail, UserReq } from 'src/app/types';
import { TrainingDialogComponent } from '../school-details/training-information/training-dialog/training-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { OutreachDetailsComponent } from './outreach-details/outreach-details.component';

@Component({
  selector: 'app-school-table-view',
  templateUrl: './school-table-view.component.html',
  styleUrls: ['./school-table-view.component.scss']
})
export class SchoolTableViewComponent implements OnInit {
  displayedColumns = ['position', 'name', 'contactNum', 'city', 'pincode', 'email', 'outreach', 'actions'];
  dataSource: any[] = [];
  allSchoolDetail: any[] = [];
  loggedInUserDetails!: UserReq;
  isAuthorized = false;

  schoolFilterControl = new FormControl('');

  constructor(
    private schoolService: SchoolService,
    private userService: UserService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head' || this.loggedInUserDetails?.nameofMyTeam === 'TrainTheTrainer_Head';
    if(this.loggedInUserDetails?.nameofMyTeam === 'OutReach') {
      this.displayedColumns = ['position', 'name', 'contactNum', 'city', 'pincode', 'email', 'actions'];
    }

    this.isAuthorized ? this.getAllSchoolByCity() : this.getAllocatedSchools();
    
  }

  getAllocatedSchools() {
    const schoolAllocated = this.loggedInUserDetails?.schoolAllocated;
    // ['Pune', 'Mumbai'];
    
    this.spinner.show();
    this.schoolService.getAllocatedSchools(schoolAllocated).subscribe((resp: any) => {
      this.spinner.hide();
      this.allSchoolDetail = JSON.parse(JSON.stringify(resp));
      this.dataSource = resp;
      this.searchSchool();
    })
  }


  getAllSchoolByCity() {
    const cities = this.loggedInUserDetails.citiesAllocated ? this.loggedInUserDetails.citiesAllocated : ['Pune'];
    // ['Pune', 'Mumbai'];
    
    this.spinner.show();
    this.schoolService.getAllSchoolByCity(cities).subscribe((resp: any) => {
      this.spinner.hide();
      this.allSchoolDetail = JSON.parse(JSON.stringify(resp));
      this.dataSource = resp;
      this.searchSchool();
    })
  }


  addNewSchool() {
    this.router.navigate(['/register-school']);
  }

  navigateToSchoolDetails(id: number) {
    this.router.navigate([`/school-details/${id}`]);
  }

  searchSchool() {
    this.schoolFilterControl.valueChanges.subscribe(val => {
      this.dataSource = val ? this.allSchoolDetail.filter(usr => usr.name.toLowerCase().includes(val.toLowerCase()) || usr.city.toLowerCase().includes(val.toLowerCase()) || usr.contactNum1.toLowerCase().includes(val.toLowerCase()) || usr.email.toLowerCase().includes(val.toLowerCase())) : this.allSchoolDetail;
    })
  }

  getOutReachDetails(schoolDetail: SchoolDetail) {
    this.spinner.show();
    this.schoolService.getOutreachBySchoolId(schoolDetail.id).subscribe((resp: ResponseDto<any>) => {
      //console.log('resp', resp);
      const outreachDetail = resp.message;
      if(outreachDetail) {
        this.getUserByEmail(outreachDetail);
      }
      })
  }

  getUserByEmail(user: OutReach) {
    this.userService.getUserByEmail(user.outreachuserid).subscribe((resp: ResponseDto<UserReq>) => {
      this.spinner.hide();
      const userDetail = resp.message;
      this.openOutreachDetails(userDetail);
    })
  }

  openOutreachDetails(userDetail: UserReq) {
    //console.log('userDetail', userDetail);
    const config = new MatDialogConfig(); 
      config.width= "50vw";
      config.disableClose=true;
      config.data = userDetail;
      const dialog = this.dialog.open(OutreachDetailsComponent, config);
  
      dialog.afterClosed().subscribe(resp => {
        //console.log('resp', resp)
      })
    }
}
