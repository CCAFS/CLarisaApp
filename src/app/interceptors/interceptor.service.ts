import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';



@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>,next: HttpHandler):Observable<HttpEvent<any>>{

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     'Authorization': 'Basic '+ window.btoa("marlosadmin:6723646")
    //   })
    // };

    const headers =  new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Basic '+ window.btoa(environment.userData.user+":"+environment.userData.password)
    })

    const reqClone = req.clone({
      headers
    })
    console.log("pasó por el interceptor");
return next.handle(reqClone)
  }
}
