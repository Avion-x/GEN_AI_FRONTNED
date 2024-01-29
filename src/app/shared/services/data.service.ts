import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import {throwError, Observable, from, Subscription, BehaviorSubject} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs/operators'
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from './auth.service';

//const appUrl = 'http://127.0.0.1:8000/';
const appUrl = 'http://54.213.228.141:8000/';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public token:any = '';
  public currentUser:any;

  constructor(private httpClient: HttpClient) {
    // this.authenticationService.user.subscribe(user => this.currentUser = user);
    // console.log('currentUser', this.currentUser)
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //     //this.token = 'Bearer ' + this.getIdToken();

  //     this.token = 'Token ' + 'd03190df82c766c3aab6aaa35adb52fefd5d6263';
  //     //console.log('---------------------------------Token', this.msalIdToken);
  //     if (this.token) {
  //         request = request.clone({
  //             setHeaders: {
  //               Authorization: this.token
  //             }
  //         });
  //     }
  
  //     return next.handle(request);
  //   }

    // intercept(
    //   request: HttpRequest<any>,
    //   next: HttpHandler
    // ): Observable<HttpEvent<any>> {
    //   const { token } = this.authService.userValue;
    //   if (token) {
    //     request = request.clone({
    //       setHeaders: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //   }
    //   return next.handle(request).pipe(
    //     catchError((err) => {
    //       if (err.status === 401) {
    //         this.authService.logout();
    //       }
    //       const error = err.error.message || err.statusText;
    //       return throwError(error);
    //     })
    //   );
    // }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      if (error.status === 401) {
        // auto logout if 401 response returned from api
        //location.reload(true);
        location.reload();
      }
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  apiDelegate(req: any):Observable<any> {
    //this.baseUrl = environment[environment.useEnv].baseUrl;
    const httpOptions = {
      params: req.params
    };
    //const url = `${this.baseUrl}`;
    //const url = window.location.protocol + "//" + window.location.host + "/api/";
   // const url = 'http://127.0.0.1:5000/api/'
    switch (req.method.toLowerCase()) {
      case 'get':
        return this.httpClient.get(appUrl + req.action, httpOptions).pipe(retry(2), catchError(this.handleError));
      case 'post':
        return this.httpClient.post(appUrl + req.action, req.data);
      case 'put':
        return this.httpClient.put(appUrl + req.action, req.data).pipe(retry(2), catchError(this.handleError));
      case 'patch':
        return this.httpClient.patch(appUrl + req.action, req.data).pipe(retry(2), catchError(this.handleError));
      case 'delete':
        return this.httpClient.delete(appUrl + req.action, httpOptions).pipe(retry(2), catchError(this.handleError));
      case 'download':
        return this.httpClient.get(appUrl + req.action, {responseType: 'arraybuffer', params: req.params});
      default:
        return this.httpClient.get(appUrl + req.action, httpOptions).pipe(retry(2), catchError(this.handleError));
    }
  }
}
