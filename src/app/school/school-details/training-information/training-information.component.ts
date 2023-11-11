import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { UserReq, SchoolDetail, ResponseDto, Trainer } from 'src/app/types';
import { OutreachDialogComponent } from '../outreach-information/outreach-dialog/outreach-dialog.component';
import { TrainingDialogComponent } from './training-dialog/training-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-information',
  templateUrl: './training-information.component.html',
  styleUrls: ['./training-information.component.scss']
})
export class  TrainingInformationComponent implements OnInit  {

  displayedColumns = ['position', 'dataValidated', 'trainingPartCompleted', 'dateofCompletion', 'actions'];
  // displayFilterColumns = ['positionFilter', 'firstnameFilter', 'lastnameFilter', 'emailFilter', 'actionFilter']
  dataSource: Trainer[] = [];
  allPOCDetail: Trainer[] = [];
  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  @Input() schoolDetails!: SchoolDetail;

  constructor(
    private dialog: MatDialog,
    private loginService: LoginService,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    if(!this.isAuthorized) {
      this.displayedColumns.pop();
    }
    this.getTrainerBySchoolId();
  }

  getTrainerBySchoolId() {
    this.schoolService.getTrainerBySchoolId(this.schoolDetails.id).subscribe((resp: ResponseDto<Trainer>) => {
    this.spinner.hide();
    //console.log('resp', resp);
    this.dataSource = [resp.message];
    // this.allPOCDetail = resp;
    })
  }

  openTrainerDetails(isEditMode: boolean, trainerDetail?: Trainer) {
    this.spinner.show();
    this.schoolService.getUsersAllocatedToSchool(this.schoolDetails.id).subscribe((resp: ResponseDto<any>) => {
      
      const teamDetail = resp?.message;
      const isHeadTrainerAndTrainerAvailable = teamDetail?.trainingHeadAllocated && teamDetail?.trainingAllocated;
      if(isHeadTrainerAndTrainerAvailable) {
        this.spinner.hide();
        const config = new MatDialogConfig(); 
        config.width= "60vw";
        config.disableClose=true;
        config.data = isEditMode ? {schoolId: this.schoolDetails.id, ...trainerDetail} : {schoolId: this.schoolDetails.id};
        const dialog = this.dialog.open(TrainingDialogComponent, config);
    
        dialog.afterClosed().subscribe(resp => {
          if(resp) {
            this.getTrainerBySchoolId();
          }
        })
      } 
      else {
        this.loginService.showError('Please add trainer data');
        this.spinner.hide();
      }
    }, err => {
      this.loginService.showError('Something went wrong');
      this.spinner.hide();
    })
    
  }

  getUserByEmail(email: string) {
    this.spinner.show();
    this.userService.getUserByEmail(email).subscribe((resp: ResponseDto<UserReq>) => {
      this.spinner.hide();
      const id = resp?.message?.id;
      this.router.navigate(['/user-profile'], {queryParams: {id}});
    }, err => {
      this.spinner.hide();
      this.loginService.showError('No Data Available')
    })
  }



}
