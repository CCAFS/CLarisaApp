import { Component, OnInit } from '@angular/core';
import { ClarisaServiceService } from '../../services/clarisa-service.service';

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.css']
})
export class InstitutionsComponent implements OnInit {

  constructor(private _clarisaService: ClarisaServiceService) { }

  ngOnInit() {
    this._clarisaService.getInstitutions().subscribe(resp=>{
      console.log(resp);
    })
  }

}
