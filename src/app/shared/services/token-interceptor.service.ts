import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { from, lastValueFrom, Observable, throwError } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService:AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }


  private async handleAccess(req: HttpRequest<any>, next: HttpHandler):
        Promise<HttpEvent<any>> {
        const user: any = await this.authService.getUserInfo();
        console.log(user, 'user----------')
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Token ${user.token}` 
          }
        })
    
        return await lastValueFrom(next.handle(authReq).pipe(
          catchError((err) => {
              if (err.status === 401) {
                   // this.authService.logout();
              }
              const error = err.error.message || err.statusText;
              return throwError(error);
            })
        ));
  }
  // intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
  //  const { token } = this.authService.userValue;
   
  //  //const token = 'Token d03190df82c766c3aab6aaa35adb52fefd5d6263'
  //   if (token) {
  //     console.log('token----', token);
  //     request = request.clone({
  //       setHeaders: {
  //         Authorization: `Token ${token}`,
  //         "ngrok-skip-browser-warning": 'true'
  //         //"Access-Control-Allow-Origin": "*",
  //         //"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  //         //"Access-Control-Allow-Headers":"*"
  //       },
  //     });
  //   }
  //   return next.handle(request).pipe(
  //     catchError((err) => {
  //       if (err.status === 401) {
  //        // this.authService.logout();
  //       }
  //       const error = err.error.message || err.statusText;
  //       return throwError(error);
  //     })
  //   );
  // }


}
