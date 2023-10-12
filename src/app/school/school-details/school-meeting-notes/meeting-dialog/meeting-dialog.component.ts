import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { ResponseDto, SchoolMOM, UserReq } from 'src/app/types';

@Component({
  selector: 'app-meeting-dialog',
  templateUrl: './meeting-dialog.component.html',
  styleUrls: ['./meeting-dialog.component.scss']
})
export class MeetingDialogComponent implements OnInit {

  momForm!: FormGroup;

  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  header = 'Add Meeting Notes'
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MeetingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schoolService: SchoolService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    this.header = this.data['id'] ? 'Edit Meeting Notes' : 'Add Meeting Notes';

    this.initializeForm();
  }

  initializeForm() {
    const momDetail = this.data;
    this.momForm = this.fb.group({
      meetingDateTime: [momDetail.id ? momDetail.meetingDateTime : ''],
      nextAppointment: [momDetail.id ? momDetail.nextAppointment : ''],
      mom: [momDetail.id ? momDetail.mom : ''],
      feedback_Whatwentwell: [momDetail.id ? momDetail.feedback_Whatwentwell : ''],
      feedback_Improvement: [momDetail.id ? momDetail.feedback_Improvement : ''],
    })
  }

  submitMOM() {
    this.spinner.show();
    const payload: SchoolMOM = this.momForm.getRawValue();
    payload.meetingDateTime = new Date(this.momForm.controls['meetingDateTime']?.value).toISOString();
    payload.nextAppointment = new Date(this.momForm.controls['nextAppointment']?.value).toISOString();
    payload.schoolNmReq = {id: this.data.schoolId};
    this.data['id'] ? this.updateMOM(payload) : this.saveMOM(payload);
  }

  saveMOM(payload: SchoolMOM) {
    this.schoolService.saveMOM(payload).subscribe((resp: ResponseDto<SchoolMOM>) => {
      this.loginService.showSuccess('Meeting Notes Added Successfully');
      this.dialogRef.close(true);

    }, err => {
      this.spinner.hide();
    })
  }

  updateMOM(payload: SchoolMOM) {
    payload.id = this.data.id;
    this.schoolService.updateMOM(payload).subscribe((resp: ResponseDto<SchoolMOM>) => {
      this.loginService.showSuccess('Meeting Notes Updated Successfully');
      this.dialogRef.close(true);

    }, (err) => {
      console.log('err', err)
      this.loginService.showError('Something went wrong')
      this.spinner.hide();
    })
  }

  close() {
    this.dialogRef.close();
  }

}
