import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage:string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthService,
    private dataService:DataService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  get f() {
    return this.loginForm.controls;
  }

  // onSubmit() {
  //   if (this.loginForm.invalid) {
  //     return;
  //   }

  //   this.authenticationService
  //     .login(this.f.username.value, this.f.password.value)
  //     .pipe(first())
  //     .subscribe({
  //       next: () => {
  //         this.router.navigate(['/home']);
  //       },
  //       error: (error) => {
  //         this.error = error;
  //       },
  //     });
  // }

//   onSubmit() {
//     this.submitted = true;

//     // reset alerts on submit
//     //this.alertService.clear();

//     // stop here if form is invalid
//     if (this.loginForm.invalid) {
//         return;
//     }

//     this.loading = true;
//     console.log(this.f['username'].value , 'this.f');
//     this.authenticationService.login(this.f['username'].value, this.f['password'].value)
//         .pipe(first())
//         .subscribe({
//             next: () => {
//                 // get return url from query parameters or default to home page
//                 //const returnUrl = this.router.snapshot.queryParams['returnUrl'] || '/';
//                 const returnUrl = '/home'
//                 this.router.navigateByUrl(returnUrl);
//             },
//             error: error => {
//                 //this.alertService.error(error);
//                 this.loading = false;
//             }
//         });
// }

onSubmit() {
  this.submitted = true;
  if (this.loginForm.invalid) {
      return;
  }
  this.loading = true;
  const user = { username: this.f['username'].value, password: this.f['password'].value }
  const loginData = {
    action: 'login/',
    method: 'post',
    data: user
  }
  this.dataService.apiDelegate(loginData).subscribe((result: any) => {
    console.log('result', result);
    if(result.token){
      localStorage.removeItem('currentUser');
      localStorage.setItem('currentUser', JSON.stringify(result));
      const userData:any = localStorage.getItem('currentUser')
      console.log('userData----',JSON.parse(userData));
     // this.authenticationService.userSubject = JSON.stringify(result);
      const returnUrl = '/home'
      this.router.navigateByUrl(returnUrl);
    } else {
      this.errorMessage = result.error;
      this.loading = false;
    }
  }, (error:any) => {
    console.log('Login Error:', error);
    //this.apolloMetaMenuLoade = false;
    this.loading = false;
  })
}

}
