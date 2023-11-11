import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { ResponseDto, UserReq } from 'src/app/types';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {

  teamForm!: FormGroup;
  loggedInUserDetails!: UserReq;
  isAuthorized = false;
  header = 'Add Team';
  teamList: Array<string> = [];
  schoolId!: number;
  existingUser:any = null;
  constructor(
    private dialogRef: MatDialogRef<AddTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loginService: LoginService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private schoolService: SchoolService,
  ) {

  }

  ngOnInit(): void {

    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    this.header = this.data?.id ? 'Edit Team' : 'Add Team';

    this.getMBPTeam();    
  }

  getMBPTeam() {
    this.spinner.show();
    this.loginService.getMBPTeam().subscribe(resp => {
      this.spinner.hide();
      this.teamList = Object.values(resp).filter(val => val !== 'Central_Mool');
      this.initializeForm();
    })
  }

  initializeForm() {
    this.teamForm = this.fb.group({
      team: ['', Validators.required],
      userId: [null, Validators.required],
      newUserId: [null],
    })
  }

  selectedTeam(evt: MatSelectChange) {
    this.existingUser = null;
    this.teamForm.controls['userId']?.enable();
    this.teamForm.controls['userId']?.reset();
    this.getUsersAllocatedToSchool();
    if(this.data) {

    }
  }

  saveTeam(closeDialog: boolean) {
    this.existingUser?.id ? this.editUserToSchool(closeDialog) : this.addUserToSchool(closeDialog)
  }

  addUserToSchool(closeDialog: boolean) {
    const userId = this.teamForm.controls['userId']?.getRawValue();
    this.schoolService.addUserToSchool(this.schoolId, userId).subscribe(resp => {
    // console.log('resp', resp);
    if(closeDialog) {
      this.dialogRef.close(true);
    }
    this.loginService.showSuccess(`${this.teamForm.controls['team']?.value} Added Successfully`);

    })
  }

  editUserToSchool(closeDialog: boolean) {
    const userId = this.teamForm.controls['userId']?.getRawValue();
    const newUserId = this.teamForm.controls['newUserId']?.getRawValue();
    this.schoolService.editUserToSchool(this.schoolId, userId, newUserId).subscribe(resp => {
    // console.log('resp', resp);
    if(closeDialog) {
      this.dialogRef.close(true);
    }
    this.loginService.showSuccess(`${this.teamForm.controls['team']?.value} Edited Successfully`);

    })
  }

  getUsersAllocatedToSchool() {
    this.spinner.show();
    this.schoolService.getUsersAllocatedToSchool(this.schoolId).subscribe((resp: ResponseDto<any>) => {
      this.spinner.hide();
      // console.log('resp', resp)
      const userId = Object.keys(resp.message);
      // console.log('userId', userId)
      const userDetail: any = Object.values(resp.message)
      userDetail.forEach((elt: any, idx: number) => {
        elt['id'] = userId[idx];
      });
      // console.log('userDetail', userDetail);
      this.existingUser = userDetail?.find((elt: any) =>  elt?.nameofMyTeam === this.teamForm.controls['team']?.value);
      // console.log('this.existingUser', this.existingUser)
      if(this.existingUser) {
        this.teamForm.controls['userId']?.patchValue(this.existingUser?.id);
        this.teamForm.controls['userId']?.disable();
      }
    })
  }

  close() {
    this.dialogRef.close();
  }

}
