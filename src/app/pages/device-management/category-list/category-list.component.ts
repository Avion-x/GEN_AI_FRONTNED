import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

import {MenuItem} from 'primeng/api';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import {ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  providers: [ConfirmationService,MessageService]
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
  public seletedSubCategoryToAdd:any;
  public mainCategoryDeletionLoadiong:boolean = false;
  public mainCategoryFormTitle!:string;
  public mainCategoryFormType!:string;
  public subCategoryFormTitle!:string;
  public subCategoryFormType!:string;

  public mainCatActionMenuItems!: MenuItem[];
  public subCatActionMenuItems!:MenuItem[];

  //public subCategoryForm!: FormGroup;
  //public mainCategoryForm!:FormGroup;

  public mainCategoryForm: FormGroup = new FormGroup({
    id: new FormControl(''),
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
    private confirmationService: ConfirmationService,
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
      id:[''],
      category: ['', [Validators.required]],
      description:[''],
      status:['', [Validators.required]],
      comments:[''],
      valid_till:['', [Validators.required]]
    })
  }

  setSubForm(){
    this.subCategoryForm = this.fb.group({
      id:[''],
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
    this.mainCategoryFormTitle= 'Create Category';
    this.mainCategoryFormType = 'add';
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
    if(this.mainCategoryFormType == 'add'){
      this.mainCategoryForm.patchValue({
        valid_till: this.mainCategoryForm.get('valid_till')?.value ? moment(this.mainCategoryForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
        //last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
        id:this.mainCategoryForm.get('id')?.disable()
      })
    } else {
      this.mainCategoryForm.patchValue({
        valid_till: this.mainCategoryForm.get('valid_till')?.value ? moment(this.mainCategoryForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
        //last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
        //id:this.mainCategoryForm.get('confirmPassword')?.disable()
      })
    }
   
    //console.log(JSON.stringify(this.userForm.value));
    const setUser = {
        action: 'product/productcategory/',
        method: this.mainCategoryFormType == 'add'?'post':'put',
        data: this.mainCategoryForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        this.createCategoryLoader = false;        
        //this.successResponce = result;
        console.log('successResponce', result);
        if(!_.isEmpty(result)) {
          //this.afterSuccess(); 
          if(this.mainCategoryFormType == 'add'){
            this.messageService.add({severity:'success', summary:'Success', detail:'Category created successfully'});
          } else{
            this.messageService.add({severity:'success', summary:'Success', detail:'Category updated successfully'});
          }        
          
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

  addSubCaterory(){
    //console.log('subCategoryForm', this.subCategoryForm.value)
    //this.productSubCategoryData.push({'sub_category':'', 'created_at':'', 'customer':'', 'valid_till':'', 'comments':'', 'description':'description'})
    //this.productSubCategoryCreationData.push(this.subCategoryForm.value);
    this.subCategoryForm.get('product_category')?.setValue( this.seletedMainProductToAddSubCategory.id);
    console.log('this.subCategoryForm.invalid', this.subCategoryForm.invalid);
    console.log('this.subCategoryForm', this.subCategoryForm.value);    
    this.submitted = true;
    if (this.subCategoryForm.invalid) {
      return;
    }
    this.productSubCategoryLoader = true;
    if(this.subCategoryFormType == 'add'){
      this.subCategoryForm.patchValue({
        valid_till: this.subCategoryForm.get('valid_till')?.value ? moment(this.subCategoryForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
        id:this.subCategoryForm.get('id')?.disable()
      })
    } else {
      this.subCategoryForm.patchValue({
        valid_till: this.subCategoryForm.get('valid_till')?.value ? moment(this.subCategoryForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
      })
    }
   console.log('this.seletedMainProductToAddSubCategory.id', this.seletedMainProductToAddSubCategory.id);
    const setUser = {
        action: 'product/productsubcategory/',
        method: this.subCategoryFormType == 'add'?'post':'put',
        data: this.subCategoryForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        this.createCategoryLoader = false;       
        if(!_.isEmpty(result)) {
          if(this.subCategoryFormType == 'add'){
            this.messageService.add({severity:'success', summary:'Success', detail:'Sub Category created successfully'});
          } else{
            this.messageService.add({severity:'success', summary:'Success', detail:'Sub Category updated successfully'});
          }       
          this.productSubCategoryLoader = false;
          this.getProductsCat();
          this.getProductsSubCategory(this.seletedMainProductToAddSubCategory);
        }      
      }, error => {
        console.log('error',error);
        this.productSubCategoryLoader = false;
      })
    this.subCategoryForm.reset();
    this.submitted = false;
  }

  public setMainCatActionMenu(selectedMainCategory:any){
    console.log('selectedMainCategory', selectedMainCategory);
    this.mainCatActionMenuItems = [{
      label: 'Actions',
      items: [
      {
          label: 'Edit',
          icon: 'pi pi-pencil',
          //disabled: true,
          command: () => {
              this.showUpdateMianCategory(selectedMainCategory);
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          //disabled: true,
          command: () => {
            this.deleteMainCategory(selectedMainCategory);
          }
      }
      ]}
    ];
  }

  showUpdateMianCategory(selectedMainCategory:any) {
    this.mainCategoryFormTitle= 'Update Category';
    this.mainCategoryFormType = 'edit';
    this.mainCategoryFormSidebar = true;
    this.mainCategoryForm.patchValue({
      id:selectedMainCategory.id,
      category: selectedMainCategory.category,
      description:selectedMainCategory.description,
      status:selectedMainCategory.status,
      comments:selectedMainCategory.comments,
      valid_till:moment(selectedMainCategory.valid_till).format('YYYY-MM-DD')
    })
  }

  deleteMainCategory(selectedCategory:any){
    console.log('selectedCategory to delete', selectedCategory);
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //console.log('selectedUserId', userId);
        this.mainCategoryDeletionLoadiong = true;
        const getUsers = {
          action: 'product/productcategory/',
          method: 'delete',
          params: {
            id: selectedCategory.id
          }
        }
        this.dataService.apiDelegate(getUsers).subscribe((result: any) => {
          console.log('delete main category', result);
          // if(!_.isEmpty(result)){        
          //     this.usersList = result;
          // }
          //this.deleteResponce = result.message;
          this.messageService.add({severity:'info', summary:'Confirmed', detail:result.message});
          this.getProductsCat();          
          this.mainCategoryDeletionLoadiong = false;
        }, error => {
          this.mainCategoryDeletionLoadiong = false;
        })
          
      },
      reject: (type:any) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
              break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
              break;
          }
      }
    });
  }

  public setSubCatActionMenu(selectedSubCategory:any){
    console.log('selected Sub Product', selectedSubCategory);
    this.subCatActionMenuItems = [{
      label: 'Actions',
      items: [
      {
          label: 'Edit',
          icon: 'pi pi-pencil',
          //disabled: true,
          command: () => {
              this.showUpdateSubCategory(selectedSubCategory);
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          //disabled: true,
          command: () => {
              this.deleteSubCategory(selectedSubCategory);
          }
      }
      ]}
  ];
  }

  deleteSubCategory(selectedSubCategory:any){
    console.log('selectedSubCategory to delete', selectedSubCategory);
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //console.log('selectedUserId', userId);
        this.mainCategoryDeletionLoadiong = true;
        const getUsers = {
          action: 'product/productsubcategory/',
          method: 'delete',
          params: {
            id: selectedSubCategory.id
          }
        }
        this.dataService.apiDelegate(getUsers).subscribe((result: any) => {
          console.log('delete sub category', result);
          // if(!_.isEmpty(result)){        
          //     this.usersList = result;
          // }
          //this.deleteResponce = result.message;
          this.messageService.add({severity:'info', summary:'Confirmed', detail:result.message});
          //this.getProductsCat();  
          this.getProductsSubCategory(selectedSubCategory);      
          this.mainCategoryDeletionLoadiong = false;
        }, error => {
          this.mainCategoryDeletionLoadiong = false;
        })
          
      },
      reject: (type:any) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
              break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
              break;
          }
      }
    });
  }

  showUpdateSubCategory(selectedSubCategory:any){    
    this.subCategoryFormTitle= 'Update';
    this.subCategoryFormType = 'edit';
    this.subCategoryFormSidebar = true;
    this.subCategoryForm.patchValue({
      id:selectedSubCategory.id,
      product_category:selectedSubCategory.product_category,
      sub_category: selectedSubCategory.sub_category,
      description:selectedSubCategory.description,
      status:selectedSubCategory.status,
      comments:selectedSubCategory.comments,
      valid_till:moment(selectedSubCategory.valid_till).format('YYYY-MM-DD')
    })
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
    this.subCategoryFormTitle = 'Create';
    this.subCategoryFormType='add';
    this.subCategoryFormSidebar = true;
    this.seletedSubCategoryToAdd = selectedMainProduct;
    console.log('seletedSubCategoryToAdd', this.seletedSubCategoryToAdd);
    
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
    this.selectedRowId = 'tableExpantion'+selectedproduct.id;
    this.selectedProductId = selectedproduct.id;
    this.seletedMainProductToAddSubCategory = selectedproduct;
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
        product_category: selectedproduct.id
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
