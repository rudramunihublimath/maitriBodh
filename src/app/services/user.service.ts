import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseDto, UserReq, UserTableDto } from '../types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  emitEmail: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient
  ) { }

  getAllUsersById(id: number) {
    let params = new HttpParams().set('id', id);
    return this.http.get<UserTableDto[]>(`${environment.securedBaseUrl}/Login/findUserReportingMe`, {params});
  }

  getUserByMobile(contactNum: string) {
    let params = new HttpParams().set('contactNum', contactNum);
    return this.http.get(`${environment.securedBaseUrl}/Login/findUserByMobile`, {params});
  }

  getUserByEmail(email: string) {
    let params = new HttpParams().set('email', email);
    return this.http.get<ResponseDto<UserReq>>(`${environment.securedBaseUrl}/Login/findByEmail`, {params});
  }

  getUserById(id: string) {
    let params = new HttpParams().set('id', id);
    return this.http.get<ResponseDto<UserReq>>(`${environment.securedBaseUrl}/Login/findUserId`, {params});
  }

  updateUser(userDetails: UserReq) {
    return this.http.put(`${environment.securedBaseUrl}/Login/UpdateUserData`, userDetails);
  }
}
