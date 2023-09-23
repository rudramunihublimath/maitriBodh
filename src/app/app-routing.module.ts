import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './credComponent/login/login.component';
import { RegistrationComponent } from './credComponent/registration/registration.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { HomeComponent } from './credComponent/home/home.component';
import { UserTableViewComponent } from './user/user-table-view/user-table-view.component';

const routes: Routes =  [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'user-details', component: UserTableViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
