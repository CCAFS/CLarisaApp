import { Component, OnInit } from '@angular/core';
import { ClarisaServiceService } from "../../services/clarisa-service.service";
import * as XLSX from "xlsx";
import { GrayLiterature } from "../../interfaces/GrayLiterature";
declare var $;

@Component({
  selector: 'app-publications',
  templateUrl: './grayLiterature.component.html',
  styleUrls: ['./grayLiterature.component.css']
})
export class GrayLiteratureComponent implements OnInit {
  publicationsget: any;
  viewinfo = false;
  rows: [][];
  publications: Array<GrayLiterature> = [];
  selectedOption : String;
  printedOption: Number;
  selectedCRP : String;
  printedCRP: String;
  options = [
    { name : "2021", value: 2021 },
    { name : "2020", value: 2020 },
    { name : "2019", value: 2019 },
  ]
  optionsCRP = [
    { name : "Wheat", value: "Wheat" },
    { name : "WLE", value: "WLE" },
    { name : "Livestock", value: "Livestock" },
    { name : "Maize", value: "Maize" },
    { name : "CCAFS", value: "CCAFS" },
    { name : "RTB", value: "RTB" },
    { name : "PIM", value: "PIM" },
    { name : "Rice", value: "Rice" },
    { name : "Fish", value: "Fish" },
    { name : "A4NH", value: "A4NH" },
    { name : "FTA", value: "FTA" },
    { name : "GLDC", value: "GLDC" },
    { name : "BigData", value: "BigData" },
    { name : "EiB", value: "EiB" },
    { name : "Genebank", value: "Genebank" },
    { name : "Gender", value: "Gender" }
  ]
  phaseName: String = "AR";
  rest = 0;
  totalInstCode = 0;
  WoAcept = 0;
  restActive = true;
  WoAceptActive = true;
  autoGenerateFile = true;

  constructor(private _clarisaService: ClarisaServiceService) {}

  pushStorage(json) {
    if (!localStorage.getItem('grayLiterature')) {
      let newStorage = [];
      localStorage.setItem('grayLiterature', JSON.stringify(newStorage));
    }
    let jsonTotal = JSON.parse(localStorage.getItem('grayLiterature'));
    jsonTotal.push(json);
    var myJSON = JSON.stringify(jsonTotal);
    localStorage.setItem('grayLiterature', myJSON);
  }

  ngOnInit() {
    // this._clarisaService.getPublications(this.printedCRP).subscribe((resp) => {
    //   console.log(resp);
    //   this.publicationsget = resp;
    // });
  }

  onFileChange(evt: any) {
    this.printedOption = +this.selectedOption;
    this.printedCRP = this.selectedCRP;
    this.restActive = true;
    this.WoAceptActive = true;
    this.autoGenerateFile = true;
    const target: DataTransfer = <DataTransfer>evt.target;

    if (target.files.length !== 1) throw new Error("cannot use multiple files");

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      this.publications = [];
      this.rows = [];
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      console.log(wb.SheetNames);
      const wsname: string = wb.SheetNames[0];
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
        let publication: GrayLiterature = {
          articleURL: pub[9],
          type: pub[3],
          authorlist: [],
          authors: pub[4],
          doi: pub[7],
          handle: pub[8],      
          isOpenAccess: pub[6] == "Yes" ? true : false,   
          phase: {
            name: this.phaseName,
            year: this.printedOption,
          },
          title: pub[2],          
          year: pub[5]
        };
        this.publications.push(publication);
        console.log(this.publications);
      }
      first = true;
    });
    //console.log("rows", rows);
    //console.log("para excel");
    //console.log(this.publications);
  }

  postAllPublications() {
    let timeseg = 3;
    let cont = 0;
    this.publications.forEach((pub) => {
      timeseg++;
      setTimeout(() => {
        let json = {
          "articleURL": pub.articleURL,
          "type": pub.type,
          "authorList": [],
          "authors": pub.authors,
          "doi": pub.doi,
          "handle": pub.handle,          
          "isOpenAccess": pub.isOpenAccess,          
          "phase": {
            "name": this.phaseName,
            "year": this.printedOption,
          },
          "title": pub.title,        
          "year": pub.year
        };
        console.log("Creando post para registro "+cont);
        if (pub.id == undefined || pub.id == "" || pub.id == " ") {
          if (true) {
            this._clarisaService
              .createPublicationOther(this.printedCRP, json)
              .subscribe((resp) => {
                console.log("resp", resp);
                pub.id = resp;
                pub.accepted = true;
                console.log(resp + " subido");
              }, (err) => {
                console.log("resp",err);
              });
              this.pushStorage(pub);
            cont++;
          }
        } else {
          // console.log("Ya se envío");
        }
      }, timeseg * 100);
    });
    console.log(this.publications);
    this.validateRest();
  }

  validateRest() {
    this.rest=0;
    this.publications.forEach((pub) => {
      if (pub.id!=''){
        this.totalInstCode++;
      }else{
        this.rest++;
      }
    });
 }

  exportFilefromStorage() {
    /* generate a worksheet original with code publications*/
    var wsIns = XLSX.utils.json_to_sheet(JSON.parse(localStorage.getItem('grayLiterature')));

    /* add to workbook */
    var wbIns = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbIns, wsIns, "GrayLiterature");

    /* write workbook and force a download */
    XLSX.writeFile(wbIns, "Publications with code from storage.xlsx");
  }

  exportFile() {
    let publicationsOriginal = [];
    let publicationswithInstCode = [];
    this.publications.forEach((pub) => {
      let publication: GrayLiterature = {
        id: pub.id,
        articleURL: pub.articleURL,
        type: pub.type,
        authorlist: [],
        authors: pub.authors,
        doi: pub.doi,
        handle: pub.handle,        
        isOpenAccess: pub.isOpenAccess,                
        phase: {
          name: this.phaseName,
          year: this.printedOption,
        },
        title: pub.title,        
        year: pub.year
      };
      publicationsOriginal.push(publication);
    });

    /* generate a worksheet original with code*/
    var ws = XLSX.utils.json_to_sheet(publicationsOriginal);

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "GrayLiterature");

    /* write workbook and force a download */
    XLSX.writeFile(wb, "GrayLiterature.xlsx");
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