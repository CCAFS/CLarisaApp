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
    if (!localStorage.getItem('publications')) {
      let newStorage = [];
      localStorage.setItem('publications', JSON.stringify(newStorage));
    }
    let jsonTotal = JSON.parse(localStorage.getItem('publications'));
    jsonTotal.push(json);
    var myJSON = JSON.stringify(jsonTotal);
    localStorage.setItem('publications', myJSON);
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
            name: this.phaseName,
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
    let timeseg = 3;
    let cont = 0;
    this.publications.forEach((pub) => {
      timeseg++;
      setTimeout(() => {
        let json = {
          "articleURL": pub.articleURL,
          "authorList": [],
          "authors": pub.authors,
          "doi": pub.doi,
          "handle": pub.handle,
          "isISIJournal": pub.isISIJournal,
          "isOpenAccess": pub.isOpenAccess,
          "issue": pub.issue,
          "journal": pub.journal,
          "npages": pub.npages,
          "phase": {
            "name": this.phaseName,
            "year": this.printedOption,
          },
          "title": pub.title,
          "volume": pub.volume,
          "year": pub.year
        };
        console.log("Creando post para registro "+cont);
        if (pub.id == undefined || pub.id == "" || pub.id == " ") {
          if (true) {
            this._clarisaService
              .createPublication(this.printedCRP, json)
              .subscribe((resp) => {
                console.log("resp", resp);
                pub.id = resp;
                console.log(resp + " subido");
              }, (err) => {
                console.log("resp",err);
              });
            cont++;
          }
        } else {
          // console.log("Ya se envío");
        }
      }, timeseg * 100);
    });
    console.log(this.publications);
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
        id: pub.id,
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
          name: this.phaseName,
          year: this.printedOption,
        },
        title: pub.title,
        volume: pub.volume,
        year: pub.year
      };
      publicationsOriginal.push(publication);
    });

    /* generate a worksheet original with code*/
    var ws = XLSX.utils.json_to_sheet(publicationsOriginal);

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Publications");

    /* write workbook and force a download */
    XLSX.writeFile(wb, "Publications.xlsx");
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