import { Component, OnInit } from '@angular/core';

import { ClarisaServiceService } from '../../services/clarisa-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  cgiarEntities:any = [];

  innovation:any;

  constructor(
    private _clarisaService: ClarisaServiceService,
    private activatedRoute: ActivatedRoute
  ) {
    // Parameters
    this.activatedRoute.params.subscribe( params => {
      console.log(params);
    });
  }

  ngOnInit() {

    // this._clarisaService.getCgiarEntities().subscribe((data:any) => {
    //   this.cgiarEntities = data.result;
    // });

 

  }

}
