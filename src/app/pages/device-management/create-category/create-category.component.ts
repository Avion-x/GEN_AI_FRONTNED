import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {

  public breadcrumblist:any[] = []; 
  public backUrl:string = '';
  public hasSubCategory:boolean = false;
  public productSubCategoryData:any[] = [];
  public subCategoryForm!: FormGroup;
  public mainCategoryForm!: FormGroup;
  // profileForm = new FormGroup({
  //   firstName: new FormControl(''),
  //   lastName: new FormControl(''),
  // });

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private appConfig:AppConfigService,
    public fb: FormBuilder) { }

  ngOnInit(): void {
    this.backUrl = this.appConfig.urlDeviceManagement;
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Device Management','url':this.appConfig.urlDeviceManagement, 'disabled':true}, {'name':'Create New Category','url':'', 'disabled':true});
    this.setMainForm();
    this.setSubForm();
  }

  setMainForm(){
    this.mainCategoryForm = this.fb.group({
      categoryName: ['', [Validators.required]],
      customer:['', [Validators.required]],
      validTill:['', [Validators.required]],
      createdBy:['', [Validators.required]],
      comments:['', [Validators.required]],
      description:['', [Validators.required]]
    })
  }

  setSubForm(){
    this.subCategoryForm = this.fb.group({
      subCategoryName: ['', [Validators.required]],
      customer:['', [Validators.required]],
      validTill:['', [Validators.required]],
      createdAt:['', [Validators.required]],
      comments:['', [Validators.required]],
      description:['', [Validators.required]]
    })
  }

  addSubCaterory(){
    //console.log('subCategoryForm', this.subCategoryForm.value)
    //this.productSubCategoryData.push({'sub_category':'', 'created_at':'', 'customer':'', 'valid_till':'', 'comments':'', 'description':'description'})
    this.productSubCategoryData.push(this.subCategoryForm.value);
    this.subCategoryForm.reset();
  }

  submitForm(){
    console.log('this.mainCategoryForm ', this.mainCategoryForm.value);
    console.log('this.productSubCategoryData', this.productSubCategoryData);
  }

}
