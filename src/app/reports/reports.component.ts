import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  panelOpenState = false;
  states: Array<string> = [];
  state = new FormControl('');
  blob!: Blob;

  constructor(
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.getStates(1);
  }

  getStates(countryId: number) {
    this.loginService.getStates(countryId).subscribe(resp => {
      this.states = Object.values(resp);
    })
  }

  selectedState(evt: MatSelectChange) {
    const state = evt.value;
    if(state) {
      this.downloadReport1(state);
    }
  }

  downloadReport1(state: string) {
    this.spinner.show();
    this.loginService.downloadReport1(state).subscribe((resp: HttpResponse<Blob>) => {

      // Extract content disposition header
      const contentDisposition = resp.headers.get('content-disposition') || '';

      // Extract the file name
      const matches = /filename=([^;]+)/ig.exec(contentDisposition) || '';
      const fileName = (matches[1] || 'untitled').trim();

      this.blob = new Blob([(resp.body as Blob)], {type: 'application/octet-stream'});
      const downloadURL = window.URL.createObjectURL((resp.body as Blob));
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = fileName;
      link.click();

      this.loginService.showSuccess('File Downloaded Successfully');
      this.spinner.hide();

    }, err => {
      this.spinner.hide();
    })
  }



}
