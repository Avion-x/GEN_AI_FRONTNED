import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

// const apiUrl = 'http://127.0.0.1:8000';
const apiUrl = 'http://44.235.235.248:8000';
export class User {
  email?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {

    this.userSubject = new BehaviorSubject<User> (
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.user = this.userSubject.asObservable();

  }

  public get userValue(): User {
   // console.log('this.userSubject.value;', this.userSubject.value);
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${apiUrl}/login/`, { username: username, password: password })
      .pipe(
        map(({token}) => {
          let user: User = {
            email: username,
            token: token,
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    const userEmpty = {}
    localStorage.removeItem('currentUser');
    this.userSubject.next(userEmpty);
  }
}
