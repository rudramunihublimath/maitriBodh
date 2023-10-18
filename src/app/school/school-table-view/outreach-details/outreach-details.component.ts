import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-outreach-details',
  templateUrl: './outreach-details.component.html',
  styleUrls: ['./outreach-details.component.scss']
})
export class OutreachDetailsComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<OutreachDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  ngOnInit(): void {
    //console.log('data', this.data);
    
  }

  close() {
    this.dialogRef.close();
  }
}
