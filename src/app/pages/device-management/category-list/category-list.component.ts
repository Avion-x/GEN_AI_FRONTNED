import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

import {MenuItem} from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  public currentUser:any;
  public productCategoryData:any[] = [];
  public showMainCategory:boolean = false;
  public selectedMainCategory:any;
  public selectedSubCategory:any;

  public productSubCategoryData:any[] = [];

  public productSubCategoryCreationData:any[] = [];

  public breadcrumblist:any[] = [];

  public productsLoader:boolean = false;
  public productSubCategoryLoader:boolean = false;
 
  public backUrl:string = '';

  public showSubCat:boolean=false;
  public selectedRowId:string = '';
  public selectedProductId:string = '';
  public subCategoryFormSidebar:boolean = false;

  mainCatActionMenuItems!: MenuItem[];
  subCatActionMenuItems!:MenuItem[];

  public subCategoryForm!: FormGroup;

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private appConfig:AppConfigService,
    public fb: FormBuilder) {
      this.authenticationService.user.subscribe(user => this.currentUser = user);
    //console.log('currentUser', this.currentUser)
     }

  ngOnInit(): void {
   
    this.backUrl = this.appConfig.urlDeviceManagement;
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Device Management','url':'', 'disabled':true});
    this.getProductsCat();
    this.showMainCategory = true;
    //this.setMainCatMenu();
    this.setSubForm();
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
    this.productSubCategoryCreationData.push(this.subCategoryForm.value);
    this.subCategoryForm.reset();
  }

  public setMainCatMenu(selectedProduct:any){
    console.log('selected Main Product', selectedProduct);
    this.mainCatActionMenuItems = [{
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

  public setMainSubCatActionMenu(selectedSubProduct:any){
    console.log('selected Sub Product', selectedSubProduct);
    this.subCatActionMenuItems = [{
      label: 'Actions',
      items: [{
          label: 'Add Devices',
          icon: 'pi pi-plus',
          command: () => {
              this.navigateToProducts(selectedSubProduct);
          }
      },{
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

  getProductsCat(){
    this.productsLoader = true;
    const getProductCategory = {
      action: 'product/productcategory/',
      method: 'get',
      // params: {
      //   unixid: this.userLogged
      // }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.productCategoryData = result;
      this.productsLoader = false;
      //console.log('this.productCategoryData', this.productCategoryData);
    })
  }

  showCreateSubCategory(selectedMainProduct:any) {
    this.subCategoryFormSidebar = true;
    console.log('selectedMainProduct', selectedMainProduct);
  }

  navigateToCreateNewCategory(){
    const url = this.appConfig.urlCreateNewCategory;
    this._router.navigateByUrl(url);
  }

  // clearRoutePath(){
  //   const url = 'home/devices';
  //   this._router.navigateByUrl(url);
  // }

  navigateToSubCategory(selectedCategory:any){
    const url = 'home/productCategories/'+selectedCategory;
    this._router.navigateByUrl(url);
  }


  getProductsSubCategory(selectedproduct:any){        
    this.productSubCategoryLoader = true;
    this.productSubCategoryData=[];
    this.selectedRowId = 'tableExpantion'+selectedproduct;
    this.selectedProductId = selectedproduct;
    //console.log('this.selectedRowId', this.selectedRowId);
    // const selectedElement = document.getElementById('tableExpantion'+selectedproduct);
    // let myTag = this.el.nativeElement.querySelector(".expantionPanel");
    // if(myTag.classList.contains('show'))
    // {
    //     myTag.classList.remove('show'); 
    // }
    // selectedElement?.classList.add('show');



   // console.log('productCat')
    //this.selectedMainCategory = selectedproduct
    // const url = 'home/devices/'+this.selectedMainCategory;
    // this._router.navigateByUrl(url);

   
    const getProductCategory = {
      action: 'product/productsubcategory/',
      method: 'get',
      params: {
        product_category: selectedproduct
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.productSubCategoryData = result.data;
      this.productSubCategoryLoader = false;
      //console.log('productSubCategoryData', this.productSubCategoryData);
    })
  }

  navigateToProducts(selectedSubCat:any){
    this.selectedSubCategory = selectedSubCat;
    const url = this.appConfig.urlDeviceManagement + '/' + selectedSubCat + '/deviceList';
    // console.log('url', url)
    this._router.navigateByUrl(url);
  }


}
