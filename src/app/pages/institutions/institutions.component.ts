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
  institutionsget: any;
  viewinfo=false;
  rows: [][];
  institutions = [];
  // institutionsWithCode = [];
  crp = 'RTB';
  rest = 0;
  totalInstCode = 0;
  WoAcept = 0;
  restActive = true;
  WoAceptActive = true;
  autoGenerateFile = true;
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
  constructor(private _clarisaService: ClarisaServiceService) { 
    // var obj = { name: "John", age: 30, city: "New York" };
    // this.pushStorage(obj);
    

    // console.log(JSON.parse(localStorage.getItem('institutions')));
  }

 pushStorage(json){

  if(!localStorage.getItem('institutions')){
    let newStorage = [];
    localStorage.setItem('institutions', JSON.stringify(newStorage));
  }

  let jsonTotal= JSON.parse(localStorage.getItem('institutions'));
  jsonTotal.push(json);
  var myJSON = JSON.stringify(jsonTotal);
  localStorage.setItem('institutions', myJSON);
  
 }

  rejectAllGet() {
    this.institutionsget.forEach((inst) => {
      // console.log(inst.id);
      this.reject(inst.id);
    })
  }
  ngOnInit() {
    setInterval(
      () => {
        this.validateRest();
      }, 1000);
    //this._clarisaService.getInstitutionsRequestsByCgiarEntity(this.crp).subscribe((resp) => {
      this._clarisaService.getTest().subscribe((resp) => {
      console.log(resp);
      this.institutionsget = resp;
    });
  }
  reject(id) {




    this._clarisaService
      .AcceptOrRejectInstitutions(this.crp, "", id)
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
    this.restActive = true;
    this.WoAceptActive = true;
    this.autoGenerateFile = true;
    // console.log(evt.target.files);
    const target: DataTransfer = <DataTransfer>evt.target;

    if (target.files.length !== 1) throw new Error("cannot use multiple files");

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      this.institutions = [];
      // this.institutionsWithCode = [];
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
          ISOAlpha2: inst[5],
          UserRequest: inst[6],
          send: inst[7],
          Accepted: inst[8],
          Institutiontypecode: inst[9],
          json: inst[10],
          InstitutionId: ''

        };
        console.log(inst);
        this.institutions.push(institution);


        // let institutionWithId = {
        //   IdRequest: inst[0],
        //   Institutionname: inst[1],
        //   Acronym: inst[2],
        //   Website: inst[3],
        //   InstitutionId: ''

        // };



        // this.institutionsWithCode.push(institutionWithId);
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

    let timeseg = 0;
    let cont=0;
    this.institutions.forEach((inst) => {
      timeseg++;
      setTimeout(() => {
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
        console.log(test)
        // console.log(this.strjson(inst.json));
        if (inst.IdRequest == undefined || inst.IdRequest == "" || inst.IdRequest == " ") {
          let random = Math.floor(Math.random() * (10 - 0)) + 0;
          // console.log(random);
          // if (random == 0) {
          //   inst.IdRequest = undefined;
          // } else {
          //   inst.IdRequest = random;
          // }
          // if (random != 0) {
          if (true) {
            ///////////////
            this._clarisaService
              .createInstitutions(this.crp, test)
              .subscribe((resp) => {
                console.log(resp);
                inst.IdRequest = resp.message.id;
                // console.log(this.institutionsWithCode);
                // this.institutionsWithCode[cont].IdRequest = resp.id;
                inst.send = "Yes";
                console.log(resp.message.id + " subido");
                this.validateRest();
                
                let random2 = Math.floor(Math.random() * (2 - 0)) + 0;
                // if (random2 != 0) {
                if (true) {

                  //////////////////
                  console.log("rechazando: " + inst.IdRequest);
                  this._clarisaService
                    .AcceptOrRejectInstitutions(this.crp, "", inst.IdRequest)
                    .subscribe((resp) => {
                      this.validateRest();
                      console.log(resp);
                      console.log("Id Institution: "+resp.message.institutionDTO.code);
                      inst.InstitutionId = resp.message.institutionDTO.code;
                      // this.institutionsWithCode[cont].InstitutionId = resp.institutionDTO.code;
                      
                      console.log(inst.IdRequest + " Acptado: ");
                      inst.Accepted = "Yes";
                      this.pushStorage(inst);
                    }, (err) => {
                      this.validateRest();
                    });
                  ////////////////
                }

              }, (err) => {
                this.validateRest();
              });
              cont++;
            //////////////
          }

        } else {
          // console.log("Ya se envío");
          // console.log(test.name);
        }

      }, timeseg * 100);


    });
    console.log(this.institutions);
    this.validateRest();
  }

  validateRest() {
    this.rest = 0;
    this.WoAcept = 0;
    this.totalInstCode=0;
    this.institutions.forEach((inst) => {

      if(inst.InstitutionId != ''){
        this.totalInstCode++;
        if(this.totalInstCode==this.institutions.length){
          if (this.autoGenerateFile) {
            // alert("Campos completos");
            this.autoGenerateFile=false;
            this.exportFile();
            this.viewinfo = true;
            this.WoAceptActive = false;
          }
           
        }
      }

      if (inst.IdRequest == undefined || inst.IdRequest == "" || inst.IdRequest == " ") {
        this.rest++;

      }
      if (inst.Accepted == undefined || inst.Accepted == "" || inst.Accepted == " ") {
        this.WoAcept++;
      }
      if(this.rest==0 && this.restActive){
        this.viewinfo = true;
        this.restActive = false;
      }
      // if(this.WoAcept==0 && this.WoAceptActive){
 
        
      // }
    //   if(!this.WoAceptActive  && this.autoGenerateFile){
     
    //  this.autoGenerateFile = false;
    //   }
    });
  }
  AceptAllInstitutions() {
    let timeseg = 0;
   
    
    this.institutions.forEach((inst) => {
      setTimeout(() => {
      if (inst.Accepted == undefined && inst.IdRequest != undefined) {


        console.log("rechazando: " + inst.IdRequest);
        this._clarisaService
          .AcceptOrRejectInstitutions(this.crp, "", inst.IdRequest)
          .subscribe((resp) => {
            console.log(resp);
            console.log("Id Institution: "+resp.institutionDTO.code);
                      inst.InstitutionId = resp.institutionDTO.code;
            console.log(inst.IdRequest + " rechazado: ");
            inst.Accepted = 'Yes';
            this.pushStorage(inst);
          });

      }
    }, timeseg * 100);
    });
    console.log(this.institutions);
  }
  exportFilefromStorage(){
  
          /* generate a worksheet original with code institutions*/
          var wsIns = XLSX.utils.json_to_sheet(  JSON.parse(localStorage.getItem('institutions')));

          /* add to workbook */
          var wbIns = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wbIns, wsIns, "Institutions");
    
          /* write workbook and force a download */
          XLSX.writeFile(wbIns, "Institutions with code from storage.xlsx");
  }
  exportFile() {
    let institutionsOriginal = [] ;
    let institutionswithInstCode = [] ;
    this.institutions.forEach((inst) => {
      let institution = {
        IdRequest: inst.IdRequest,
        Institutionname: inst.Institutionname,
        Acronym: inst.Acronym,
        Website: inst.Website,
        InstitutionType: inst.InstitutionType,
        ISOAlpha2: inst.ISOAlpha2,
        UserRequest: inst.UserRequest,
        send: inst.send,
        Accepted: inst.Accepted,
        Institutiontypecode: inst.Institutiontypecode,
        json: inst.json
  
      };
 
      institutionsOriginal.push(institution);
    });


    this.institutions.forEach((inst) => {
      let institution = {
        IdRequest: inst.IdRequest,
        Institutionname: inst.Institutionname,
        Acronym: inst.Acronym,
        Website: inst.Website,
        InstitutionId: inst.InstitutionId

  
      };
 
      institutionswithInstCode.push(institution);
    });
    


    // console.log(inst);
    
    

    /* generate a worksheet original with code*/
    var ws = XLSX.utils.json_to_sheet(institutionsOriginal);

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Institutions");

    /* write workbook and force a download */
    XLSX.writeFile(wb, "Institutions.xlsx");

    setTimeout(() => {
      /* generate a worksheet original with code institutions*/
      var wsIns = XLSX.utils.json_to_sheet(institutionswithInstCode);

      /* add to workbook */
      var wbIns = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wbIns, wsIns, "Institutions");

      /* write workbook and force a download */
      XLSX.writeFile(wbIns, "Institutions with code.xlsx");

    }, 3000);




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