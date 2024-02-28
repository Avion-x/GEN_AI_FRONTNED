import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  public backUrl:string = '';
  public breadcrumblist:any[] = [];
  public userForm!: FormGroup;

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    public fb: FormBuilder) { }

  ngOnInit(): void {
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Users Management','url':this.appConfig.urlUsersList, 'disabled':false}, {'name':'Users List','url':this.appConfig.urlUsersList, 'disabled':false}, {'name':'Add New User','url':'', 'disabled':true});
    this.backUrl = this.appConfig.urlUsersList;
    this.setForm();
  }

  setForm(){
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name:['', [Validators.required]],
      email:['', [Validators.required]],
      role_name:['', [Validators.required]],
      username:['', [Validators.required]],
      password:['', [Validators.required]],
      confirmPassword:['', [Validators.required]],
      is_active:['', [Validators.required]],
      is_staff:['', [Validators.required]],
      valid_till:['', [Validators.required]],
      comments:['', [Validators.required]]      
    })
  }
}
