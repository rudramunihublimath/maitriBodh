import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { ResponseDto, SchoolDetail, SchoolTableDetail, UserReq } from 'src/app/types';

@Component({
  selector: 'app-school-table-view',
  templateUrl: './school-table-view.component.html',
  styleUrls: ['./school-table-view.component.scss']
})
export class SchoolTableViewComponent implements OnInit {
  displayedColumns = ['position', 'name', 'contactNum', 'city', 'pincode', 'email', 'actions'];
  dataSource: any[] = [];
  allSchoolDetail: any[] = [];
  loggedInUserDetails!: UserReq;
  isAuthorized = false;

  schoolFilterControl = new FormControl('');

  constructor(
    private schoolService: SchoolService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    this.getAllSchollByCity()
  }


  getAllSchollByCity() {
    const cities = this.loggedInUserDetails.citiesAllocated ? this.loggedInUserDetails.citiesAllocated : ['Pune'];
    // ['Pune', 'Mumbai'];
    
    this.spinner.show();
    this.schoolService.getAllSchollByCity(cities).subscribe((resp: any) => {
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
    console.log('id', id)
    this.router.navigate([`/school-details/${id}`]);
  }

  searchSchool() {
    this.schoolFilterControl.valueChanges.subscribe(val => {
      this.dataSource = val ? this.allSchoolDetail.filter(usr => usr.name.toLowerCase().includes(val.toLowerCase()) || usr.city.toLowerCase().includes(val.toLowerCase()) || usr.contactNum1.toLowerCase().includes(val.toLowerCase()) || usr.email.toLowerCase().includes(val.toLowerCase())) : this.allSchoolDetail;
    })
  }
}
