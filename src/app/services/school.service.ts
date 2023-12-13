import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Agreement, MBPFlag, OutReach, ResponseDto, SchoolDetail, SchoolGrade, SchoolMOM, SchoolPOC, SchoolTableDetail, Trainer } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  constructor(
    private http: HttpClient
  ) { }


  getTargetPhase() {
    return this.http.get<ResponseDto<SchoolDetail>>(`${environment.securedBaseUrl}/School/FindTargetPhase`);
  }

  getBoards() {
    return this.http.get<ResponseDto<SchoolDetail>>(`${environment.securedBaseUrl}/School/FindSchoolBoard`);
  }

  getAllSchoolByCity(cities: Array<string>) {
    let params = new HttpParams().set('cities', cities.toString());
    return this.http.get<Array<SchoolTableDetail>>(`${environment.securedBaseUrl}/School/findAllSchoolInCity`, {params});
  }

  getAllocatedSchools(schoolId: Array<number>) {
    let params = new HttpParams().set('schoolId', schoolId.toString());
    return this.http.get<Array<SchoolTableDetail>>(`${environment.securedBaseUrl}/School/findAllSchoolForGivenCityndSchoolName`, {params});
  }
 
  getSchoolById(id: number) {
    let params = new HttpParams().set('id', id);
    return this.http.get<ResponseDto<SchoolDetail>>(`${environment.securedBaseUrl}/School/FindSchoolById`, {params});
  }

  saveSchool(schoolDetails: any) {
    return this.http.post(`${environment.securedBaseUrl}/School/RegisterSchoolName`, schoolDetails);
  }

  updateSchool(schoolDetails: any, schoolId: number) {
    let params = new HttpParams().set('schoolId', schoolId);
    return this.http.put(`${environment.securedBaseUrl}/School/EditSchoolInfo`, schoolDetails, {params});
  }

  // ---------- POC Endpoints ------------------ //
  getPOCBySchoolId(id: number) {
    let params = new HttpParams().set('id', id);
    return this.http.get<Array<SchoolPOC>>(`${environment.securedBaseUrl}/School/FindSchoolPOC`, {params});
  }

  savePOC(pocDetails: SchoolPOC) {
    return this.http.post<ResponseDto<any>>(`${environment.securedBaseUrl}/School/AddSchoolPOC`, pocDetails);
  }

  updatePOC(pocDetails: SchoolPOC) {
    return this.http.put<ResponseDto<any>>(`${environment.securedBaseUrl}/School/EditSchoolPOC`, pocDetails);
  }

  // ---------- MOM Endpoints ------------------ //
  getMOMBySchoolId(id: number) {
    let params = new HttpParams().set('id', id);
    return this.http.get<Array<SchoolMOM>>(`${environment.securedBaseUrl}/School/FindSchoolMBPMeeting`, {params});
  }

  saveMOM(momDetails: SchoolMOM) {
    return this.http.post<ResponseDto<SchoolMOM>>(`${environment.securedBaseUrl}/School/AddSchoolMBPMeeting`, momDetails);
  }

  updateMOM(momDetails: SchoolMOM) {
    return this.http.put<ResponseDto<SchoolMOM>>(`${environment.securedBaseUrl}/School/EditSchoolMBPMeeting`, momDetails);
  }

  // ---------- Outreach Endpoints ------------------ //
  getOutreachBySchoolId(id: number) {
    let params = new HttpParams().set('schoolId', id);
    return this.http.get<ResponseDto<OutReach>>(`${environment.securedBaseUrl}/School/FindOutReach`, {params});
  }

  saveOutreach(outReachDetails: OutReach, schoolId: number) {
    let params = new HttpParams().set('schoolId', schoolId);
    return this.http.post<ResponseDto<OutReach>>(`${environment.securedBaseUrl}/School/AddOutReach`, outReachDetails, {params});
  }

  updateOutreach(outReachDetails: OutReach, schoolId: number) {
        let params = new HttpParams().set('schoolId', schoolId);
    return this.http.put<ResponseDto<OutReach>>(`${environment.securedBaseUrl}/School/EditOutReach`, outReachDetails, {params});
  }

  // ---------- Trainer Endpoints ------------------ //
  getTrainerBySchoolId(id: number) {
    let params = new HttpParams().set('schoolId', id);
    return this.http.get<ResponseDto<Trainer>>(`${environment.securedBaseUrl}/School/FindTraining`, {params});
  }

  saveTrainer(trainerDetails: Trainer, schoolId: number) {
    let params = new HttpParams().set('schoolId', schoolId);
    return this.http.post<ResponseDto<Trainer>>(`${environment.securedBaseUrl}/School/AddTraining`, trainerDetails, {params});
  }

  updateTrainer(trainerDetails: Trainer, schoolId: number) {
        let params = new HttpParams().set('schoolId', schoolId);
    return this.http.put<ResponseDto<Trainer>>(`${environment.securedBaseUrl}/School/EditTraining`, trainerDetails, {params});
  }

  // ---------- Flags Endpoints ------------------ //
  getFlagBySchoolId(id: number) {
    let params = new HttpParams().set('schoolId', id);
    return this.http.get<ResponseDto<MBPFlag>>(`${environment.securedBaseUrl}/School/FindMBPFlagInfo`, {params});
  }

  saveFlag(flagDetails: MBPFlag, schoolId: number) {
    let params = new HttpParams().set('schoolId', schoolId);
    return this.http.post<ResponseDto<MBPFlag>>(`${environment.securedBaseUrl}/School/AddMBPFlagInfo`, flagDetails, {params});
  }

  updateFlag(flagDetails: MBPFlag, schoolId: number) {
        let params = new HttpParams().set('schoolId', schoolId);
    return this.http.put<ResponseDto<MBPFlag>>(`${environment.securedBaseUrl}/School/EditMBPFlagInfo`, flagDetails, {params});
  }

  // ---------- Agreement Endpoints ------------------ //
  getAgreementBySchoolId(id: number) {
    let params = new HttpParams().set('schoolId', id);
    return this.http.get<ResponseDto<Agreement>>(`${environment.securedBaseUrl}/School/FindAgreementInfo`, {params});
  }

  saveAgreement(agreementDetails: Agreement, schoolId: number) {
    let params = new HttpParams().set('schoolId', schoolId);
    return this.http.post<ResponseDto<Agreement>>(`${environment.securedBaseUrl}/School/AddAgreementInfo`, agreementDetails, {params});
  }

  updateAgreement(agreementDetails: Agreement, schoolId: number) {
        let params = new HttpParams().set('schoolId', schoolId);
    return this.http.put<ResponseDto<Agreement>>(`${environment.securedBaseUrl}/School/EditAgreementInfo`, agreementDetails, {params});
  }

    // ---------- Grade Endpoints ------------------ //
    getGradeBySchoolId(id: number) {
      let params = new HttpParams().set('id', id);
      return this.http.get<Array<SchoolGrade>>(`${environment.securedBaseUrl}/School/FindSchoolGrades`, {params});
    }
  
    saveGrade(gradeDetails: SchoolGrade) {
      // let params = new HttpParams().set('schoolId', schoolId);
      return this.http.post<ResponseDto<SchoolGrade>>(`${environment.securedBaseUrl}/School/AddSchoolGrades`, gradeDetails);
    }
  
    updateGrade(gradeDetails: SchoolGrade) {
      // let params = new HttpParams().set('schoolId', schoolId);
      return this.http.put<ResponseDto<SchoolGrade>>(`${environment.securedBaseUrl}/School/EditSchoolGrades`, gradeDetails);
    }

    getGradeYears() {
      return this.http.get<any>(`${environment.securedBaseUrl}/School/FindAllGradesYear`);
    }

    getUsersAllocatedToSchool(schoolId: number) {
      let params = new HttpParams().set('schoolId', schoolId);
      return this.http.get<any>(`${environment.securedBaseUrl}/School/findUsersAllocatedToSchool`, {params});
    }

    addUserToSchool(payload: any) {
      // let params = new HttpParams();
      // params = params.set('schoolId', schoolId);
      // params = params.set('userId', userId);
      return this.http.post<ResponseDto<any>>(`${environment.securedBaseUrl}/School/AddUserToSchool`, payload);
    }

    editUserToSchool(payload: any, newUserId: number) {
      let params = new HttpParams();
      // params = params.set('schoolId', schoolId);
      // params = params.set('userId', userId);
      params = params.set('newUserId', newUserId);
      return this.http.put<ResponseDto<any>>(`${environment.securedBaseUrl}/School/EditUserToSchool`, payload, {params});
    }

    getUserSearchBook(nameofMyTeam: string, name: string) {
      let params = new HttpParams();
      params = params.set('nameofMyTeam', nameofMyTeam);
      params = params.set('name', name);
      return this.http.get<any>(`${environment.securedBaseUrl}/Login/searchBook`, {params});
    }

    uploadSchools(file: any) {
      const formData = new FormData();
      formData.append("file", file);
      return this.http.post(`${environment.securedBaseUrl}/School/ImportSchoolListInBulk`, formData);
    }
}
