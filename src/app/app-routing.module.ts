import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './credComponent/login/login.component';
import { RegistrationComponent } from './credComponent/registration/registration.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { HomeComponent } from './credComponent/home/home.component';
import { UserTableViewComponent } from './user/user-table-view/user-table-view.component';
import { RegisterSchoolComponent } from './school/register-school/register-school.component';
import { SchoolDetailsComponent } from './school/school-details/school-details.component';
import { SchoolTableViewComponent } from './school/school-table-view/school-table-view.component';

const routes: Routes =  [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'user-details', component: UserTableViewComponent },
  { path: 'register-school', component: RegisterSchoolComponent },
  { path: 'school-details/:id', component: SchoolDetailsComponent },
  { path: 'school', component: SchoolTableViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
