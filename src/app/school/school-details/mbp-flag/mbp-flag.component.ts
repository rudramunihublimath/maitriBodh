import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { UserReq, SchoolDetail, MBPFlag, ResponseDto, Agreement } from 'src/app/types';
import { AgreementDialogComponent } from './agreement-dialog/agreement-dialog.component';
import { FlagDialogComponent } from './flag-dialog/flag-dialog.component';

@Component({
  selector: 'app-mbp-flag',
  templateUrl: './mbp-flag.component.html',
  styleUrls: ['./mbp-flag.component.scss']
})
export class MbpFlagComponent implements OnInit {

  flagForm!: FormGroup;
  agreementForm!: FormGroup;

  levels = ['Yes', 'No'];

  displayedColumns = ['schoolActive', 'schoolInterested', 'dealClosed', 'isDiscontinued', 'discontinuedDate', 'reasonValidated', 'actions'];
  agreementDisplayedColumns = ['agreementCompleted', 'agreementCompletedDate', 'agreementScanCopyLink', 'uploadedByUserId', 'actions'];

  dataSource: MBPFlag[] = [];
  agreementDataSource: Agreement[] = [];

  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  @Input() schoolDetails!: SchoolDetail;

  flagDetails!: MBPFlag;
  agreementDetails!: Agreement; 

  isFlagLoaded = false;
  isAgreementLoaded = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    this.getFlagBySchoolId();
    this.getAgreementBySchoolId();
  }


  initializeFlagForm() {
    this.flagForm = this.fb.group({
      schoolActive: [{value: this.flagDetails?.id ? this.flagDetails.schoolActive : '', disabled: !this.isAuthorized}],
      schoolInterested: [{value: this.flagDetails?.id ? this.flagDetails.schoolInterested : '', disabled: !this.isAuthorized}],
      dealClosed: [{value: this.flagDetails?.id ? this.flagDetails.dealClosed : '', disabled: !this.isAuthorized}],
      isDiscontinued: [{value: this.flagDetails?.id ? this.flagDetails.isDiscontinued : '', disabled: !this.isAuthorized}],
      discontinuedDate: [{value: this.flagDetails?.id ? this.flagDetails.discontinuedDate : '', disabled: !this.isAuthorized}],
      reasonForDiscontinue: [{value: this.flagDetails?.id ? this.flagDetails.reasonForDiscontinue : '', disabled: !this.isAuthorized}],
      reasonValidated: [{value: this.flagDetails?.id ? this.flagDetails.reasonValidated : '', disabled: !this.isAuthorized}],
    });
  }

  initializeAgreementForm() {
    this.agreementForm = this.fb.group({
      agreementCompleted: [{value: this.agreementDetails?.id ? this.agreementDetails?.agreementCompleted : '', disabled: !this.isAuthorized}],
      agreementCompletedDate: [{value: this.agreementDetails?.id ? this.agreementDetails?.agreementCompletedDate : '', disabled: !this.isAuthorized}],
      agreementScanCopyLink: [{value: this.agreementDetails?.id ? this.agreementDetails?.agreementScanCopyLink : '', disabled: !this.isAuthorized}],
      uploadedByUserId: [{value: this.agreementDetails?.id ? this.agreementDetails?.uploadedByUserId : '', disabled: !this.isAuthorized}],
    })
  }

  selectedAgreementValue(evt: MatSelectChange) {
    if(evt.value === 'No') {
      this.agreementForm.controls['agreementCompletedDate'].reset();
      this.agreementForm.controls['agreementScanCopyLink'].reset();
      this.agreementForm.controls['uploadedByUserId'].reset();
    }
  }

  getFlagBySchoolId() {
    this.schoolService.getFlagBySchoolId(this.schoolDetails.id).subscribe((resp: ResponseDto<MBPFlag>) => {
      console.log('resp', resp);
      this.isFlagLoaded = true;
      if(resp.status) {
        this.flagDetails = resp.message;
        this.dataSource = [resp.message];
      }
      this.initializeFlagForm();


    }, err => {
      this.isFlagLoaded = true;
      this.initializeFlagForm();
    })
  }

  submitFlag() {
    const payload: MBPFlag = this.flagForm.getRawValue(); 
    if(typeof this.flagForm.controls['discontinuedDate'].value !== 'string') {
      payload.discontinuedDate = this.formatDate(this.flagForm.controls['discontinuedDate'].value);
    }
    console.log('payload', payload)
    this.flagDetails?.id ? this.updateFlag(payload) : this.saveFlag(payload);

  }

  saveFlag(payload: MBPFlag) {
    this.spinner.show();
    this.schoolService.saveFlag(payload, this.schoolDetails.id).subscribe((resp: any) => {
      console.log('resp', resp);
      this.spinner.hide();
      this.loginService.showSuccess('MBP Flags Added Successfully');
    })
  }

  updateFlag(payload: MBPFlag) {
    this.spinner.show();
    this.schoolService.updateFlag(payload, this.schoolDetails.id).subscribe((resp: any) => {
      console.log('resp', resp);
      this.spinner.hide();
      this.loginService.showSuccess('MBP Flags Updated Successfully');
    })

  }

  getAgreementBySchoolId() {
    this.schoolService.getAgreementBySchoolId(this.schoolDetails.id).subscribe((resp: ResponseDto<Agreement>) => {
      this.isAgreementLoaded = true;
      if(resp.status) {
        this.agreementDetails = resp.message;
      }
      this.initializeAgreementForm();
    }, err => {
      this.initializeAgreementForm();
      this.isAgreementLoaded = true;
    })
  }

  submitAgreement() {
    const payload: Agreement = this.agreementForm.getRawValue(); 
    if(typeof this.agreementForm.controls['agreementCompletedDate'].value !== 'string') {
      payload.agreementCompletedDate = this.formatDate(this.agreementForm.controls['agreementCompletedDate'].value);
    }
    console.log('payload', payload)
    this.agreementDetails?.id ? this.updateAgreement(payload) : this.saveAgreement(payload);

  }

  saveAgreement(payload: Agreement) {
    this.spinner.show();

    this.schoolService.saveAgreement(payload, this.schoolDetails.id).subscribe((resp: any) => {
      console.log('resp', resp);
      this.spinner.hide();
      this.loginService.showSuccess('Agreement Completed Successfully');
    })
  }

  updateAgreement(payload: Agreement) {
    this.spinner.show();
    this.schoolService.updateAgreement(payload, this.schoolDetails.id).subscribe((resp: any) => {
      console.log('resp', resp);
      this.spinner.hide();
      this.loginService.showSuccess('Agreement Updated Successfully');
    })

  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(dob: Date) {
    return [
      dob.getFullYear(),
      this.padTo2Digits(dob.getMonth() + 1),
      this.padTo2Digits(dob.getDate()),
    ].join('-');
  }

  openFlagDetails(isEditMode: boolean, flagDetails?: MBPFlag) {
    const config = new MatDialogConfig(); 
    config.width= "60vw";
    config.disableClose=true;
    config.data = isEditMode ? {schoolId: this.schoolDetails.id, ...flagDetails} : {schoolId: this.schoolDetails.id};
    const dialog = this.dialog.open(FlagDialogComponent, config);

    dialog.afterClosed().subscribe(resp => {
      if(resp) {
        this.getFlagBySchoolId();
      }
    })
  }

  openAgreementDetails(isEditMode: boolean, agreementDetails?: MBPFlag) {
    const config = new MatDialogConfig(); 
    config.width= "60vw";
    config.disableClose=true;
    config.data = isEditMode ? {schoolId: this.schoolDetails.id, ...agreementDetails} : {schoolId: this.schoolDetails.id};
    const dialog = this.dialog.open(AgreementDialogComponent, config);

    dialog.afterClosed().subscribe(resp => {
      if(resp) {
        this.getAgreementBySchoolId();
      }
    })
  }
}
