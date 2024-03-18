import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

import {MenuItem} from 'primeng/api';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import {Message,MessageService} from 'primeng/api';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  providers: [MessageService]
})
export class CategoryListComponent implements OnInit {

  public currentUser:any;
  public productCategoryData:any[] = [];
  public showMainCategory:boolean = false;
  public selectedMainCategory:any;
  public selectedSubCategory:any;
  public mainCategoryFormSidebar:boolean = false;
  public createCategoryLoader:boolean = false;

  public productSubCategoryData:any[] = [];

  public productSubCategoryCreationData:any[] = [];

  public breadcrumblist:any[] = [];

  public productsLoader:boolean = false;
  public productSubCategoryLoader:boolean = false;
 
  public backUrl:string = '';
  public statusOptions:any[] = [{name:'Active', value:true}, {name:'Inactive', value:false}];

  public showSubCat:boolean=false;
  public selectedRowId:string = '';
  public selectedProductId:string = '';
  public subCategoryFormSidebar:boolean = false;
  public seletedMainProductToAddSubCategory:any;

  mainCatActionMenuItems!: MenuItem[];
  subCatActionMenuItems!:MenuItem[];

  //public subCategoryForm!: FormGroup;
  //public mainCategoryForm!:FormGroup;

  public mainCategoryForm: FormGroup = new FormGroup({
    category: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl(''),
    valid_till:new FormControl(''),
    comments:new FormControl(''),
  });
  public subCategoryForm: FormGroup = new FormGroup({
    product_category: new FormControl(''),
    sub_category:new FormControl(''),
    status: new FormControl(''),
    valid_till:new FormControl(''),
    comments:new FormControl(''),
    description: new FormControl(''),
  });
  submitted:boolean = false;

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private appConfig:AppConfigService,
    private messageService: MessageService,
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
    this.setMainCategoryForm();
    this.setSubForm();
  }

  setMainCategoryForm(){
    this.mainCategoryForm = this.fb.group({
      category: ['', [Validators.required]],
      description:[''],
      status:['', [Validators.required]],
      comments:[''],
      valid_till:['', [Validators.required]]
    })
  }

  setSubForm(){
    this.subCategoryForm = this.fb.group({
      product_category: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
      status:['', [Validators.required]],
      comments:[''],
      valid_till:['', [Validators.required]],
      description:['']
    })
  }

  get fMain(): { [key: string]: AbstractControl } {
    return this.mainCategoryForm.controls;
  }
  get fSub(): { [key: string]: AbstractControl } {
    return this.subCategoryForm.controls;
  }

  addSubCaterory(){
    //console.log('subCategoryForm', this.subCategoryForm.value)
    //this.productSubCategoryData.push({'sub_category':'', 'created_at':'', 'customer':'', 'valid_till':'', 'comments':'', 'description':'description'})
    //this.productSubCategoryCreationData.push(this.subCategoryForm.value);
    console.log('this.subCategoryForm.invalid', this.subCategoryForm.invalid);
    console.log('this.subCategoryForm', this.subCategoryForm.value);
    this.productSubCategoryLoader = true;
    this.submitted = true;
    if (this.subCategoryForm.invalid) {
      return;
    }
    this.subCategoryForm.patchValue({
      //product_category:this.subCategoryForm.get('valid_till')?.value,
      valid_till: this.subCategoryForm.get('valid_till')?.value ? moment(this.subCategoryForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
      //last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
      //confirmPassword:this.userForm.get('confirmPassword')?.disable()
    })
    //console.log(JSON.stringify(this.userForm.value));
    const setUser = {
        action: 'product/productsubcategory/',
        method: 'post',
        data: this.subCategoryForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        this.createCategoryLoader = false;        
        //this.successResponce = result;
        //console.log('successResponce', result);
        if(!_.isEmpty(result)) {
          //this.afterSuccess();          
          this.messageService.add({severity:'success', summary:'Success', detail:'Category created successfully'});
          //this.mainCategoryFormSidebar = false;
          this.productSubCategoryLoader = false;
          this.getProductsCat();
          this.getProductsSubCategory(this.seletedMainProductToAddSubCategory.id);
          //this.messageService.add({severity:'success', summary: 'Success', detail: 'User added successfully'});          
          //const responceData = result.response.Regression;
          //this.testCasesData = responceData.TestCases;
        }      
        //this.testScriptsData = responceData.TestScripts;
      }, error => {
        console.log('error',error);
        this.productSubCategoryLoader = false;
      })
    this.subCategoryForm.reset();
    this.submitted = false;
  }

  mainCategoryCancelBtn(){
    this.submitted = false;
    this.mainCategoryFormSidebar = false;
    this.mainCategoryForm.reset();
    this.createCategoryLoader = false;  
  }

  subCategoryCancelBtn(){
    this.subCategoryForm.reset();
    this.submitted = false;
    this.productSubCategoryLoader = false;
    this.subCategoryFormSidebar = false;  
  }

  showCreateNewCategory(){
    this.mainCategoryFormSidebar = true;
  }

  createNewCategory(){
    this.submitted = true;
    if (this.mainCategoryForm.invalid) {
      return;
    }
    console.log('mainCategoryForm',this.mainCategoryForm.value);
    this.createCategoryLoader = true;
    //this.submitted = true;
    // console.log('this.userForm.invalid', this.mainCategoryForm.invalid);
    // if (this.mainCategoryForm.invalid) {
    //   return;
    // } 
    this.mainCategoryForm.patchValue({
      valid_till: this.mainCategoryForm.get('valid_till')?.value ? moment(this.mainCategoryForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
      //last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
      //confirmPassword:this.userForm.get('confirmPassword')?.disable()
    })
    //console.log(JSON.stringify(this.userForm.value));
    const setUser = {
        action: 'product/productcategory/',
        method: 'post',
        data: this.mainCategoryForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        this.createCategoryLoader = false;        
        //this.successResponce = result;
        console.log('successResponce', result);
        if(!_.isEmpty(result)) {
          //this.afterSuccess();          
          this.messageService.add({severity:'success', summary:'Success', detail:'Category created successfully'});
          this.mainCategoryFormSidebar = false;
          this.getProductsCat();
          //this.messageService.add({severity:'success', summary: 'Success', detail: 'User added successfully'});          
          //const responceData = result.response.Regression;
          //this.testCasesData = responceData.TestCases;
        }      
        //this.testScriptsData = responceData.TestScripts;
      }, error => {
        console.log('error',error);
        this.createCategoryLoader = false;  
      })
      this.mainCategoryForm.reset();
      this.submitted = false;
  }

  public setMainCatMenu(selectedProduct:any){
    console.log('selected Main Product', selectedProduct);
    this.mainCatActionMenuItems = [{
      label: 'Actions',
      items: [{
          label: 'Edit',
          icon: 'pi pi-pencil',
          disabled: true,
          command: () => {
              //this.update();
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          disabled: true,
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
      items: [
      //   {
      //     label: 'Add Devices',
      //     icon: 'pi pi-plus',
      //     command: () => {
      //         this.navigateToProducts(selectedSubProduct);
      //     }
      // },
      {
          label: 'Edit',
          icon: 'pi pi-pencil',
          disabled: true,
          command: () => {
              //this.update();
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          disabled: true,
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
    this.seletedMainProductToAddSubCategory = selectedMainProduct;
    console.log('seletedMainProductToAddSubCategory', this.seletedMainProductToAddSubCategory);
    this.subCategoryForm.get('product_category')?.setValue(selectedMainProduct.id);
    //console.log('subCategoryForm', this.subCategoryForm.value);
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
      console.log('productSubCategoryData', this.productSubCategoryData);
    })
  }

  navigateToProducts(selectedSubCat:any){
    this.selectedSubCategory = selectedSubCat;
    const url = this.appConfig.urlDeviceManagement + '/' + selectedSubCat + '/deviceList';
    // console.log('url', url)
    this._router.navigateByUrl(url);
  }


}
