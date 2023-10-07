import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { OutReach, ResponseDto, SchoolDetail, UserReq } from 'src/app/types';
import { OutreachDialogComponent } from './outreach-dialog/outreach-dialog.component';

@Component({
  selector: 'app-outreach-information',
  templateUrl: './outreach-information.component.html',
  styleUrls: ['./outreach-information.component.scss']
})
export class OutreachInformationComponent implements OnInit {

  displayedColumns = ['position', 'outreachuserid', 'outreach_assigneddate', 'outreachheaduserid', 'outreachHead_assigneddate', 'actions'];
  // displayFilterColumns = ['positionFilter', 'firstnameFilter', 'lastnameFilter', 'emailFilter', 'actionFilter']
  dataSource: OutReach[] = [];
  allPOCDetail: OutReach[] = [];
  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  @Input() schoolDetails!: SchoolDetail;

  constructor(
    private dialog: MatDialog,
    private loginService: LoginService,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    
    this.getOutreachBySchoolId();
  }

  getOutreachBySchoolId() {
    this.schoolService.getOutreachBySchoolId(this.schoolDetails.id).subscribe((resp: ResponseDto<OutReach>) => {
    this.spinner.hide();
    console.log('resp', resp);
    this.dataSource = [resp.message];
    // this.allPOCDetail = resp;
    })
  }

  openOutreachDetails(isEditMode: boolean, outreachDetail?: OutReach) {
    const config = new MatDialogConfig(); 
    config.width= "60vw";
    config.disableClose=true;
    config.data = isEditMode ? {schoolId: this.schoolDetails.id, ...outreachDetail} : {schoolId: this.schoolDetails.id};
    const dialog = this.dialog.open(OutreachDialogComponent, config);

    dialog.afterClosed().subscribe(resp => {
      if(resp) {
        this.getOutreachBySchoolId();
      }
    })
  }



}
