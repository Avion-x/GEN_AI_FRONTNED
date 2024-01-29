import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {

  public breadcrumblist:any[] = []; 
  public backUrl:string = '';
  public hasSubCategory:boolean = false;
  public productsData:any[] = [];
  public productsForm!: FormGroup;

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private appConfig:AppConfigService,
    public fb: FormBuilder) { }

  ngOnInit(): void {
    this.backUrl = this.appConfig.urlDeviceManagement;
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Device Management','url':this.appConfig.urlDeviceManagement, 'disabled':true}, {'name':'Add New Product','url':'', 'disabled':true});
    this.setProductForm();
  }

  setProductForm(){
    this.productsForm = this.fb.group({
      deviceName: ['', [Validators.required]],
      series:['', [Validators.required]],
      customer:['', [Validators.required]],
      validTill:['', [Validators.required]],
      comments:['', [Validators.required]],
      description:['', [Validators.required]]
    })
  }

  addProduct(){
    //console.log('subCategoryForm', this.subCategoryForm.value)
    //this.productSubCategoryData.push({'sub_category':'', 'created_at':'', 'customer':'', 'valid_till':'', 'comments':'', 'description':'description'})
    this.productsData.push(this.productsForm.value);
    this.productsForm.reset();
  }

}
