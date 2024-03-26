import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-add-new-enterprise',
  templateUrl: './add-new-enterprise.component.html',
  styleUrls: ['./add-new-enterprise.component.scss']
})
export class AddNewEnterpriseComponent implements OnInit {

  public backUrl:string = '';
  public breadcrumblist:any[] = [];
  public enterpriseForm!: FormGroup;

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    public fb: FormBuilder) { }

  ngOnInit(): void {
    this.backUrl = this.appConfig.urlEnterpriseManagement;
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Enterprise Management','url':this.appConfig.urlEnterpriseManagement, 'disabled':true}, {'name':'Add New Enterprise','url':'', 'disabled':true});
    this.setForm();
  }

  setForm(){
    this.enterpriseForm = this.fb.group({
      enterpriseName: ['', [Validators.required]],
      logo:['', [Validators.required]],
      createdBy:['', [Validators.required]],      
      createdAt:['', [Validators.required]],      
      validTill:['', [Validators.required]],
      comments:['', [Validators.required]]
    })
  }

}
