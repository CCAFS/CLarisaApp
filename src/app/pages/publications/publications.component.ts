import { Component, OnInit } from '@angular/core';
import { ClarisaServiceService } from "../../services/clarisa-service.service";
import * as XLSX from "xlsx";
import { Publication } from "../../interfaces/PublicationI";
declare var $;

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css']
})
export class PublicationsComponent implements OnInit {
  publicationsget: any;
  viewinfo = false;
  rows: [][];
  publications: Array<Publication> = [];
  selectedOption : String;
  printedOption: Number;
  options = [
    { name : "2021", value: 2021 },
    { name : "2020", value: 2020 },
    { name : "2019", value: 2019 },
  ]
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

  constructor(private _clarisaService: ClarisaServiceService) {}

  pushStorage(json) {
    if (!localStorage.getItem('publications')) {
      let newStorage = [];
      localStorage.setItem('publications', JSON.stringify(newStorage));
    }
    let jsonTotal = JSON.parse(localStorage.getItem('publications'));
    jsonTotal.push(json);
    var myJSON = JSON.stringify(jsonTotal);
    localStorage.setItem('publications', myJSON);
  }

  rejectAllGet() {
    this.publicationsget.forEach((inst) => {
      this.reject(inst.id);
    })
  }

  ngOnInit() {
    setInterval(
      () => {
        this.validateRest();
      }, 1000);
    this._clarisaService.getInstitutionsRequestsByCgiarEntity(this.crp).subscribe((resp) => {
      console.log(resp);
      this.publicationsget = resp;
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
    this.printedOption = +this.selectedOption;
    console.log("Valor impreso", this.printedOption)
    this.restActive = true;
    this.WoAceptActive = true;
    this.autoGenerateFile = true;
    // console.log(evt.target.files);
    const target: DataTransfer = <DataTransfer>evt.target;

    if (target.files.length !== 1) throw new Error("cannot use multiple files");

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      this.publications = [];
      // this.publicationsWithCode = [];
      this.rows = [];
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      console.log(wb.SheetNames);
      const wsname: string = wb.SheetNames[2];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log("Rows normal");
      console.log(this.rows);
      this.structureJson(this.rows);
    };
    reader.readAsBinaryString(target.files[0]);

  }

  structureJson(rows) {
    let first = false;
    let coide = 0;
    rows.forEach((pub) => {
      if (first) {
        coide++;
        let publication: Publication = {
          IDRequest: pub[1],
          articleURL: pub[11],
          authorList: [],
          authors: pub[5],
          doi: pub[9],
          handle: pub[10],
          isISIJournal: pub[7] == "Yes" ? true : false,
          isOpenAccess: pub[8] == "Yes" ? true : false,
          issue: pub[13],
          journal: pub[3],
          npages: pub[14],
          phase: {
            name: "AR",
            year: this.printedOption,
          },
          title: pub[2],
          volume: pub[12],
          year: pub[4]
        };
        this.publications.push(publication);
        console.log(this.publications);
      }
      first = true;
    });
    console.log("rows", rows);
    console.log("para excel");
    console.log(this.publications);
  }

  postAllPublications() {
    let timeseg = 0;
    let cont = 0;
    this.publications.forEach((pub) => {
      timeseg++;
      setTimeout(() => {
        let test = {
          name: this.strjson(pub.json).name,
          acronym: this.strjson(pub.json).acronym,
          websiteLink: this.strjson(pub.json).websiteLink,
          institutionTypeCode: this.strjson(inst.json).institutionTypeCode,
          hqCountryIso: this.strjson(inst.json).hqCountryIso,
          externalUserMail: this.strjson(inst.json).externalUserMail,
          externalUserName: this.strjson(inst.json).externalUserName,
          externalUserComments: this.strjson(inst.json).externalUserComments,
        };
        // console.log(this.strjson(inst.json));
        if (pub.IDRequest == undefined || pub.IDRequest == "" || pub.IDRequest == " ") {
          let random = Math.floor(Math.random() * (10 - 0)) + 0;
          if (true) {
            ///////////////
            this._clarisaService
              .createInstitutions(this.crp, test)
              .subscribe((resp) => {
                console.log(resp);
                pub.IDRequest = resp.id;
                // console.log(this.publicationsWithCode);
                // this.publicationsWithCode[cont].IdRequest = resp.id;
                pub.send = "Yes";
                console.log(resp.id + " subido");
                this.validateRest();
                let random2 = Math.floor(Math.random() * (2 - 0)) + 0;
                // if (random2 != 0) {
                if (true) {
                  //////////////////
                  console.log("rechazando: " + pub.IDRequest);
                  this._clarisaService
                    .AcceptOrRejectInstitutions(this.crp, "", pub.IDRequest)
                    .subscribe((resp) => {
                      this.validateRest();
                      console.log(resp);
                      console.log("Id Institution: " + resp.institutionDTO.code);
                      pub.InstitutionId = resp.institutionDTO.code;
                      console.log(pub.IDRequest + " Acptado: ");
                      pub.Accepted = "Yes";
                      this.pushStorage(pub);
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
    console.log(this.publications);
    this.validateRest();
  }

  validateRest() {
    this.rest = 0;
    this.WoAcept = 0;
    this.totalInstCode = 0;
    this.publications.forEach((pub) => {

      if (pub.InstitutionId != '') {
        this.totalInstCode++;
        if (this.totalInstCode == this.publications.length) {
          if (this.autoGenerateFile) {
            // alert("Campos completos");
            this.autoGenerateFile = false;
            this.exportFile();
            this.viewinfo = true;
            this.WoAceptActive = false;
          }

        }
      }

      if (pub.IDRequest == undefined || pub.IDRequest == "" || pub.IDRequest == " ") {
        this.rest++;
      }
      if (pub.Accepted == undefined || pub.Accepted == "" || pub.Accepted == " ") {
        this.WoAcept++;
      }
      if (this.rest == 0 && this.restActive) {
        this.viewinfo = true;
        this.restActive = false;
      }
    });
  }

  exportFilefromStorage() {
    /* generate a worksheet original with code publications*/
    var wsIns = XLSX.utils.json_to_sheet(JSON.parse(localStorage.getItem('publications')));

    /* add to workbook */
    var wbIns = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbIns, wsIns, "Publications");

    /* write workbook and force a download */
    XLSX.writeFile(wbIns, "Publications with code from storage.xlsx");
  }

  exportFile() {
    let publicationsOriginal = [];
    let publicationswithInstCode = [];
    this.publications.forEach((pub) => {
      let publication: Publication = {
        IDRequest: pub.IDRequest,
        articleURL: pub.articleURL,
        authorList: [],
        authors: pub.authors,
        doi: pub.doi,
        handle: pub.handle,
        isISIJournal: pub.isISIJournal,
        isOpenAccess: pub.isOpenAccess,
        issue: pub.issue,
        journal: pub.journal,
        npages: pub.npages,
        phase: {
          name: "",
          year: 0,
        },
        title: pub.title,
        volume: pub.volume,
        year: pub.year
      };
      publicationsOriginal.push(publication);
    });

    this.publications.forEach((inst) => {
      let institution = {
        IdRequest: inst.IdRequest,
        Institutionname: inst.Institutionname,
        Acronym: inst.Acronym,
        Website: inst.Website,
        InstitutionId: inst.InstitutionId
      };
      publicationswithInstCode.push(institution);
    });
    // console.log(inst);

    /* generate a worksheet original with code*/
    var ws = XLSX.utils.json_to_sheet(publicationsOriginal);

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Publications");

    /* write workbook and force a download */
    XLSX.writeFile(wb, "Publications.xlsx");

    setTimeout(() => {
      /* generate a worksheet original with code publications*/
      var wsIns = XLSX.utils.json_to_sheet(publicationswithInstCode);

      /* add to workbook */
      var wbIns = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wbIns, wsIns, "Publications");

      /* write workbook and force a download */
      XLSX.writeFile(wbIns, "Publications with code.xlsx");

    }, 3000);
  }

  strjson(json) {
    return JSON.parse(json);
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