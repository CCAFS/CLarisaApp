import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

// const endpoint = 'https://clarisa.cgiar.org/api';
// Proxy http://localhost/issuesRoadmap/public/api/proxy/?url=
// https://172.22.42.118:8443/marlo-web/api/index.html#/
// http://marlodev.ciat.cgiar.org/api
// https://172.22.42.118:8443/marlo-web/api
const endpoint = '/api/';
// Proxy
const proxyURL = 'http://localhost/issuesRoadmap/public/api/clarisa'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic bWFybG9zYWRtaW46NjcyMzY0Ng=='
  })
};


@Injectable({
  providedIn: 'root'
})
export class ClarisaServiceService {

  proxyActive:Boolean = false;

  constructor(private http: HttpClient) {
    console.log('CLARISA Service ...');
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  private getQuery(query:string){
    let endQuery = endpoint + '/' + query;
    // if(this.proxyActive) endQuery = proxyURL + '/getProxy?url=' + encodeURIComponent(endQuery);
    return this.http.get(endQuery);
  }

  private postQuery(query:string, data:any){
    let endQuery = endpoint + '/' + query;
    if(this.proxyActive) endQuery = proxyURL + '/postProxy?url=' + encodeURIComponent(endQuery);
    return this.http.post(endQuery, data, httpOptions).pipe(
      map(this.extractData));
  }

  private putQuery(query:string, data:any){
    let endQuery = endpoint + '/' + query;
    if(this.proxyActive) endQuery = proxyURL + '/putProxy?url=' + encodeURIComponent(endQuery);
    return this.http.put(endQuery, data, httpOptions).pipe(
      map(this.extractData));
  }

  private deteteQuery(query:string){
    let endQuery = endpoint + '/' + query;
    if(this.proxyActive) endQuery = proxyURL + '/deleteProxy?url=' + encodeURIComponent(endQuery);
    return this.http.delete(endQuery , httpOptions).pipe(
      map(this.extractData));
  }

  // Innovations

  deleteInnovation(cgiarEntity:string, id:number, phaseName:string, phaseYear:number){
    return this.deteteQuery(cgiarEntity + '/innovations/' + id + '?phase=' + phaseName + '&year=' + phaseYear).pipe(
      map(this.extractData));
  }

  createInnovation(cgiarEntity:string, innovation:any): Observable<any> {
    return this.postQuery(cgiarEntity + '/innovations', innovation).pipe(
      map(this.extractData));
  }

  updateInnovation(cgiarEntity:string, innovation:any): Observable<any> {
    let innID = innovation.id;
    let inn = innovation;
    //delete inn.id;
    return this.putQuery(cgiarEntity + '/innovations/' + innID, inn).pipe(
      map(this.extractData));
  }

  getInnovationByID(cgiarEntity:string, id:number, phaseName:string, phaseYear:number): Observable<any> {
    return this.getQuery(cgiarEntity + '/innovations/' + id + '?phase=' + phaseName + '&year=' + phaseYear).pipe(
      map(this.extractData));
  }

  // Publications
  createPublication(cgiarEntity:string, publication:any): Observable<any>{
    return this.postQuery(cgiarEntity + '/publications', publication).pipe(
      map(this.extractData));
  }

  createInstitutions(cgiarEntity:string, Institution:any): Observable<any>{
    return this.postQuery(cgiarEntity + '/institutions/institution-requests', Institution).pipe(
      map(this.extractData));
  }

  // Control Lists

  getCgiarEntities(): Observable<any> {
    return this.getQuery('cgiar-entities?typeId=1').pipe(
      map(this.extractData));
  }

  getInnovationStages(): Observable<any> {
    return this.getQuery('stage-of-innovations').pipe(
      map(this.extractData));
  }

  getInnovationTypes(): Observable<any> {
    return this.getQuery('innovation-types').pipe(
      map(this.extractData));
  }

  getOrgTypes(): Observable<any> {
    return this.getQuery('organization-types').pipe(
      map(this.extractData));
  }

  getGeoScopes(): Observable<any> {
    return this.getQuery('geographic-scopes').pipe(
      map(this.extractData));
  }

  getRegions(): Observable<any> {
    return this.getQuery('un-regions').pipe(
      map(this.extractData));
  }

  getCountries(): Observable<any> {
    return this.getQuery('countries').pipe(
      map(this.extractData));
  }

  getInstitutions(): Observable<any> {
    return this.getQuery('institutions').pipe(
      map(this.extractData));
  }
  headers = new HttpHeaders();


}
