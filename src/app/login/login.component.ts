import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthService
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

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    //this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    console.log(this.f['username'].value , 'this.f');
    this.authenticationService.login(this.f['username'].value, this.f['password'].value)
        .pipe(first())
        .subscribe({
            next: () => {
                // get return url from query parameters or default to home page
                //const returnUrl = this.router.snapshot.queryParams['returnUrl'] || '/';
                const returnUrl = '/home'
                this.router.navigateByUrl(returnUrl);
            },
            error: error => {
                //this.alertService.error(error);
                this.loading = false;
            }
        });
}

}
