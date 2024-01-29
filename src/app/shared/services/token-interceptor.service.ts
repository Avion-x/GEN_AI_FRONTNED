import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private authService:AuthService) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
   const { token } = this.authService.userValue;
   
   //const token = 'Token d03190df82c766c3aab6aaa35adb52fefd5d6263'
    if (token) {
      console.log('token', token);
      request = request.clone({
        setHeaders: {
          Authorization: `Token ${token}`,
          "ngrok-skip-browser-warning": 'true'
          //"Access-Control-Allow-Origin": "*",
          //"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          //"Access-Control-Allow-Headers":"*"
        },
      });
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
         // this.authService.logout();
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }


}
