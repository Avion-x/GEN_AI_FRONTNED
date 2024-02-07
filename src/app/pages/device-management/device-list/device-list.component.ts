import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

import {MenuItem} from 'primeng/api';

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
  public selectedSubCategory:string = '';
  public productSubCategory:any = {};
  public productsLoader:boolean = false;

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    public fb: FormBuilder) { }

    deviceActionMenuItems!:MenuItem[];

  ngOnInit(): void {
    this.backUrl = this.appConfig.urlDeviceManagement;
    this.selectedSubCategory = this._aRoute.snapshot.params?.['subId'];
    //this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Device Management','url':this.appConfig.urlDeviceManagement, 'disabled':true}, {'name':'Add New Product','url':'', 'disabled':true});
    this.setProductForm();
    this.getProducts('');
    this.getSubCategoryDetails(this.selectedSubCategory);
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

  getProducts(productCat:any) {
    this.productsLoader = true;
    const getProductCategory = {
      action: 'product/product/',
      method: 'get',
      // params: {
      //   product_category: 3
      // }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.productsData = result.data;
      this.productsLoader = false;
      console.log('Product List', this.productsData);
    })
  }

  getSubCategoryDetails(productId:any){
    const getProductCategory = {
      action: 'product/productsubcategory/',
      method: 'get',
      params: {
        id: productId
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.productSubCategory = result.data[0]; 
      this.breadcrumblist.push({'name':'Home','url':this.appConfig.urlHome, 'disabled':false}, {'name':'Device Management','url':this.appConfig.urlDeviceManagement, 'disabled':false}, {'name':this.productSubCategory.category_name, 'url':this.appConfig.urlDeviceManagement, 'disabled':false}, {'name':this.productSubCategory.sub_category, 'disabled':false}, {'name':'Device List', 'disabled':true});
      // if(this.productMainCategory && this.productSubCategory){
      //   const mainCategoryName = this.productMainCategory.category + '-' + this.productMainCategory.id;
      //   this.backUrl = this.appConfig.urlProductCategory + '/' + this.productMainCategory.id;
      //   this.breadcrumblist.push({'name':'Home','url':this.appConfig.urlHome, 'disabled':false}, {'name':'Product Categories','url':this.appConfig.urlProductCategory, 'disabled':false}, {'name':mainCategoryName, 'url':this.backUrl, 'disabled':false}, {'name':this.productSubCategory.sub_category, 'disabled':true});
      // }      
      console.log('productSubCategory', this.productSubCategory);
    })
  }

  addProduct(){
    //console.log('subCategoryForm', this.subCategoryForm.value)
    //this.productSubCategoryData.push({'sub_category':'', 'created_at':'', 'customer':'', 'valid_till':'', 'comments':'', 'description':'description'})
    this.productsData.push(this.productsForm.value);
    this.productsForm.reset();
  }

  public seDeciveActionMenu(selectedProduct:any){
    console.log('selected Product', selectedProduct);
    this.deviceActionMenuItems = [{
      label: 'Actions',
      items: [{
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => {
              //this.update();
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => {
              //this.delete();
          }
      }
      ]}
  ];
  }

}
