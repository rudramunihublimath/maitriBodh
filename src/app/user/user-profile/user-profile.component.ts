import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { UserService } from 'src/app/services/user.service';
import { ResponseDto, SchoolTableDetail, UserReq } from 'src/app/types';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userProfileForm!: FormGroup;

  genderArr: Array<string> = ['Male', 'Female'];
  countries: Array<string> = [];
  states: Array<string> = [];
  cities: Array<string> = [];
  schools: Array<SchoolTableDetail> = [];

  countriesObject: any = null;
  statesObject: any = null;
  citiesObject: any = null;


  filteredCountries!: Observable<string[]>;

  userDetail: UserReq | null = null; 
  loggedInUserDetails: UserReq | null = null; 

  isInitialCountryLoad = true;
  isInitialStateLoad = true;
  isInitialCityLoad = true;
  isInitialAllocatedSchoolLoad = true;

  isAuthorized = false;

  url: any = null;
  defaultImg: any = null;
  isUserLogoChanged = false;
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private schoolService: SchoolService,
  ) {
    
  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head' || this.loggedInUserDetails?.nameofMyTeam === 'TrainTheTrainer_Head';
    this.defaultImg = "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
    const queryParams = this.route.snapshot.queryParams;
    if(queryParams['id']) {
      this.getUserById(queryParams['id']);
    } else {
      this.spinner.show();
      this.userDetail = JSON.parse(this.loginService.getUserDetails());
      // 'https://maitribodh.org/images/header/logo_side.png?v=20231112201126'
      if(this.userDetail?.imageName?.includes('http') || this.userDetail?.imageName?.includes('https')) {
        this.url = this.userDetail?.imageName;
      } else {
        const imageName = this.userDetail?.imageName?.split("\\").pop();
        this.url = `/assets/Maitribodh_Photo/${imageName}` ?? null;
      }
      this.initializeUserProfileForm();

      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
  }

  initializeUserProfileForm() {
    this.userProfileForm = this.fb.group({
      firstname: [{value: this.userDetail?.firstname, disabled: !this.isAuthorized}],
      lastname: [{value: this.userDetail?.lastname, disabled: !this.isAuthorized}],
      email: [{value: this.userDetail?.email, disabled: !this.isAuthorized}],
      pannum: [{value: this.userDetail?.pannum, disabled: !this.isAuthorized}],
      gender: [{value: this.userDetail?.gender === 'MALE' ? 'Male' : 'Female', disabled: !this.isAuthorized}],
      country: [{value: this.userDetail?.country, disabled: !this.isAuthorized}],
      state: [{value: this.userDetail?.state, disabled: !this.isAuthorized}],
      city: [{value: this.userDetail?.city, disabled: !this.isAuthorized}],    
      address1: [{value: this.userDetail?.address1, disabled: !this.isAuthorized}],
      address2: [{value: this.userDetail?.address2, disabled: !this.isAuthorized}],
      pincode: [{value: this.userDetail?.pincode, disabled: !this.isAuthorized}],
      contactNum1: [{value: this.userDetail?.contactNum1, disabled: !this.isAuthorized}],
      contactNum2: [{value: this.userDetail?.contactNum2, disabled: !this.isAuthorized}],
      linkdinID: [{value: this.userDetail?.linkdinID, disabled: !this.isAuthorized}],
      facebookID: [{value: this.userDetail?.facebookID, disabled: !this.isAuthorized}],
      instaID: [{value: this.userDetail?.instaID, disabled: !this.isAuthorized}],
      dob: [{value: this.userDetail?.dob, disabled: !this.isAuthorized}],
      citiesAllocated: [{value: this.userDetail?.citiesAllocated, disabled: !this.isAuthorized}],
      reportingmanagerId: [{value: this.userDetail?.reportingmanagerId, disabled: !this.isAuthorized}],
      // schoolAllocated: [{value: this.userDetail?.schoolAllocated, disabled: !this.isAuthorized}],
    })

    this.getAllSchoolByCity(this.userProfileForm.controls['citiesAllocated']?.value);
    this.getCountries();
    this.searchCountry();

  }

  getUserEmail() {
    this.userService.emitEmail.subscribe(email => {
      this.getUserByEmail(email);
    })
  }

  getUserByEmail(email: string) {
    this.spinner.show();
    this.userService.getUserByEmail(email).subscribe((resp: ResponseDto<UserReq>) => {
      this.userDetail = resp.message;
      this.initializeUserProfileForm();
      this.spinner.hide();
    })
  }

  getUserById(id: string) {
    this.spinner.show();
    this.userService.getUserById(id).subscribe((resp: ResponseDto<UserReq>) => {
      this.userDetail = resp.message;
      if(this.userDetail?.imageName?.includes('http') || this.userDetail?.imageName?.includes('https')) {
        this.url = this.userDetail?.imageName;
      } else {
        const imageName = this.userDetail?.imageName?.split("\\").pop();
        this.url = `/assets/Maitribodh_Photo/${imageName}` ?? null;
      }
      if(this.loggedInUserDetails?.id === this.userDetail?.id) {
        this.loginService.setUserDetails(this.userDetail);
      }
      this.initializeUserProfileForm();
      this.spinner.hide();
    })
  }

  updateUser() {
    const payload = {...this.userDetail, ...this.userProfileForm.getRawValue()};
    payload.gender = this.userProfileForm.controls['gender'].value.toUpperCase();

    if(typeof this.userProfileForm.controls['dob'].value !== 'string') {
      payload.dob = this.formatDate(this.userProfileForm.controls['dob'].value);
    }

    delete payload.jwtToken;
    delete payload.refreshToken;
    this.spinner.show();
    this.userService.updateUser(payload).subscribe(resp => {
      this.loginService.showSuccess('User Details Updated');
      if(this.loggedInUserDetails?.id === this.userDetail?.id) {
        this.getUserById(this.loggedInUserDetails?.id as any);
      }
      this.spinner.hide();
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

  searchCountry() {
    this.filteredCountries = this.userProfileForm.controls['country'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(ctry => ctry.toLowerCase().includes(filterValue));
  }

  getCountries() {
    this.loginService.getCountries().subscribe(resp => {
      this.countries = Object.values(resp);
      this.countriesObject = resp;

      if(this.isInitialCountryLoad) {
        const country = this.countries.find(ctry => ctry === this.userDetail?.country);
        const countryId = Object.keys(this.countriesObject).find(key => this.countriesObject[key] === this.userDetail?.country);
        
        if(countryId) {
          this.getStates(+countryId);
        }
        if(country) {
          this.userProfileForm.controls['country'].patchValue(country);
        }

        this.isInitialCountryLoad = false;
      }


    })
  }

  selectedCountry(evt: MatAutocompleteSelectedEvent) {
  const countryId = Object.keys(this.countriesObject).find(key => this.countriesObject[key] === evt.option.value);
  if(countryId) {
    this.getStates(+countryId);
  }
  }

  getStates(countryId: number) {
    this.loginService.getStates(countryId).subscribe(resp => {
      this.states = Object.values(resp);
      this.statesObject = resp;

      if(this.isInitialStateLoad) {

        const state = this.states.find(state => state === this.userDetail?.state);
        const stateId = Object.keys(this.statesObject).find(key => this.statesObject[key] === this.userDetail?.state);
        
        if(stateId) {
          this.getCities(+stateId);
        }
        if(state) {
          this.userProfileForm.controls['state'].patchValue(state);
        }

        this.isInitialStateLoad = false;
      }

    })
  }

  selectedState(evt: MatSelectChange) {
    const stateId = Object.keys(this.statesObject).find(key => this.statesObject[key] === evt.value);
    if(stateId) {
      this.getCities(+stateId);
    }
    
  }

  getCities(stateId: number) {
    this.loginService.getCities(stateId).subscribe(resp => {
      this.cities = Object.values(resp);

      if(this.isInitialCityLoad) {

        const city = this.cities.find(state => state === this.userDetail?.city);

        if(city) {
          this.userProfileForm.controls['city'].patchValue(city);
        }

        this.isInitialCityLoad = false;
      }

    })
  }

  selectedCities(evt: MatSelectChange) {
    if(evt.value) {
      this.getAllSchoolByCity(evt.value);
    }
      
  }
  
  getAllSchoolByCity(cities: Array<string>) {
    //console.log('cities', cities)
    this.schoolService.getAllSchoolByCity(cities).subscribe((resp: any) => {
      this.schools = Object.values(resp);
      //console.log('this.schools', this.schools)
    })
  }

  addUserImage(evt: any) {
    // console.log('evt', evt)
    if(evt.target.files && evt.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(evt.target.files[0]); //read file as data url
      // console.log('evt.target.files', evt.target.files)

      reader.onload = () => {
        this.url = reader.result;
        // console.log('reader', reader)
        this.isUserLogoChanged = true;
        this.uploadUserImage(evt.target.files[0]);
      }
    }
  }

  removeUserImage() {
    this.url = null;
  }

  uploadUserImage(file: any) {
    this.spinner.show();
    this.userService.uploadUserImage(this.loggedInUserDetails?.id as number, file).subscribe(resp => {
      // console.log('resp', resp)
      this.spinner.hide();
      this.loginService.showSuccess('Profile Added Successfully');
      if(this.loggedInUserDetails?.id === this.userDetail?.id) {
        this.getUserById(this.loggedInUserDetails?.id as any);
      }
    })
  }

}
