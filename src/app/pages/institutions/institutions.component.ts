import { Component, OnInit } from "@angular/core";
import { ClarisaServiceService } from "../../services/clarisa-service.service";
import * as XLSX from "xlsx";
import { Institution } from "../../interfaces/Institution";
declare var $;

@Component({
  selector: "app-institutions",
  templateUrl: "./institutions.component.html",
  styleUrls: ["./institutions.component.css"],
})
export class InstitutionsComponent implements OnInit {
  rows: [][];
  institutions = [];
  crp = 'RTB';
  rest = 0;
  WoAcept=0;
  test = {
    name: "test2",
    acronym: "test2",
    websiteLink: "test2.com",
    institutionTypeCode: "3",
    hqCountryIso: "CO",
    externalUserMail: "test@gmail.com",
    externalUserName: "test2",
    externalUserComments: "test2",
  };
  constructor(private _clarisaService: ClarisaServiceService) { }

  ngOnInit() {
    setInterval(
      ()=>{ 
        this.validateRest();
  }, 1000);
    this._clarisaService.getInstitutionsRequestsByCgiarEntity(this.crp).subscribe((resp) => {
      console.log(resp);
    });
  }
  reject() {




    this._clarisaService
      .AcceptOrRejectInstitutions(this.crp, "", 6237)
      .subscribe((resp) => {
        console.log(resp);
      });

      this._clarisaService
      .AcceptOrRejectInstitutions(this.crp, "", 6244)
      .subscribe((resp) => {
        console.log(resp);
      });




  }
  postInstitutions() {
    this._clarisaService
      .createInstitutions(this.crp, this.test)
      .subscribe((resp) => {
        console.log(resp);
      });
  }

  onFileChange(evt: any) {
    // console.log(evt.target.files);
    const target: DataTransfer = <DataTransfer>evt.target;

    if (target.files.length !== 1) throw new Error("cannot use multiple files");

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      this.institutions = [];
      this.rows = [];
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      const wsname: string = wb.SheetNames[0];
      // console.log(wsname);
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      // console.log(ws);

      this.rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log("Rows normal");
      console.log(this.rows);
      this.structureJson(this.rows);
      this.validateRest();
      // console.log(this.rows["0"]["9"]);
      // console.log(JSON.parse(this.rows["0"]["9"]));
    };
    reader.readAsBinaryString(target.files[0]);

  }

  structureJson(rows) {
    let first = false;
    let coide = 0;
    rows.forEach((inst) => {
      if (first) {
        coide++;
        let institution = {
          IdRequest: inst[0],
          Institutionname: inst[1],
          Acronym: inst[2],
          Website: inst[3],
          InstitutionType: inst[4],
          Iso: inst[5],
          UserRequest: inst[6],
          clean1: inst[7],
          clean2: inst[8],
          Institutiontypecode: inst[9],
          json: inst[10],
          status: inst[11],
        };
        // console.log(inst);
        this.institutions.push(institution);
      }
      first = true;
    });
    console.log("para excel");
    console.log(this.institutions);

    // console.log(institution);

    // console.log("Json estrucutruado");
    // console.log(this.institutions);
  }
  postAllInstitutions() {
    this.institutions.forEach((inst) => {
      
      let test = {
        name: this.strjson(inst.json).name,
        acronym: this.strjson(inst.json).acronym,
        websiteLink: this.strjson(inst.json).websiteLink,
        institutionTypeCode: this.strjson(inst.json).institutionTypeCode,
        hqCountryIso: this.strjson(inst.json).hqCountryIso,
        externalUserMail: this.strjson(inst.json).externalUserMail,
        externalUserName: this.strjson(inst.json).externalUserName,
        externalUserComments: this.strjson(inst.json).externalUserComments,
      };

      // console.log(this.strjson(inst.json));
      if (inst.IdRequest == undefined || inst.IdRequest == "" || inst.IdRequest == " ") {
        let random = Math.floor(Math.random() * (7 - 0)) + 0;
        // console.log(random);
        // if (random == 0) {
        //   inst.IdRequest = undefined;
        // } else {
        //   inst.IdRequest = random;
        // }
        if (random != 0) {
        ///////////////
        this._clarisaService
          .createInstitutions(this.crp, test)
          .subscribe((resp) => {
            console.log(resp);
            inst.IdRequest = resp.id;
            console.log(resp.id + " subido");
            this.validateRest();

            let random2 = Math.floor(Math.random() * (5 - 0)) + 0;
            if (random2 != 0) {
              //////////////////
            console.log("rechazando: "+inst.IdRequest);
            this._clarisaService
            .AcceptOrRejectInstitutions(this.crp, "", inst.IdRequest)
            .subscribe((resp) => {
              this.validateRest();
              console.log(resp);
              console.log(inst.IdRequest +" rechazado: ");
              inst.status = true;
            },(err)=>{
              this.validateRest();
            });
            ////////////////
}


          },(err)=>{
            this.validateRest();
          });

          //////////////
        }

      } else {
        // console.log("Ya se envío");
        // console.log(test.name);
      }
    });
    console.log(this.institutions);
    this.validateRest();
  }

  validateRest() {
    this.rest = 0;
    this.WoAcept=0;
    this.institutions.forEach((inst) => {
      if (inst.IdRequest == undefined || inst.IdRequest == "" || inst.IdRequest == " ") {
        this.rest++;
      }
      if (inst.status == undefined || inst.status == "" || inst.status == " ") {
        this.WoAcept++;
      }
    });
  }
  AceptAllInstitutions() {
   
    this.institutions.forEach((inst) => {

      if (inst.status == undefined && inst.IdRequest != undefined) {
  

       console.log("rechazando: "+inst.IdRequest);
        this._clarisaService
        .AcceptOrRejectInstitutions(this.crp, "", inst.IdRequest)
        .subscribe((resp) => {
          console.log(resp);
          console.log(inst.IdRequest +" rechazado: ");
          inst.status = true;
        });

      }

    });
    console.log(this.institutions);
  }

  exportFile() {
    /* generate a worksheet */
    var ws = XLSX.utils.json_to_sheet(this.institutions);

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Institutions");

    /* write workbook and force a download */
    XLSX.writeFile(wb, "sheetjs.xlsx");
  }

  strjson(json) {
    //   try {
    //     JSON.parse(json);
    // } catch (e) {
    return JSON.parse(json);
    // }
    // return "null";
  }

  testJson(json) {
    try {
      JSON.parse(json);
    } catch (e) {
      return "Yes";
    }
    return "error";
  }
}






// Source:- https://gist.github.com/jlong/2428561

// var parser = document.createElement('a');
// parser.href = "http://example.com:3000/pathname/?search=test#hash";

// parser.protocol; // => "http:"
// parser.hostname; // => "example.com"
// parser.port;     // => "3000"
// parser.pathname; // => "/pathname/"
// parser.search;   // => "?search=test"
// parser.hash;     // => "#hash"
// parser.host;     // => "example.com:3000"