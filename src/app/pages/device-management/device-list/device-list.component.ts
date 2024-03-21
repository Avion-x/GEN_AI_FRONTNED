import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import {ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';

import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class DeviceListComponent implements OnInit {

  public breadcrumblist:any[] = []; 
  public backUrl:string = '';
  public hasSubCategory:boolean = false;
  public productsData:any[] = [];
  public selectedSubCategory:string = '';
  public productSubCategory:any = {};
  public productsLoader:boolean = false;
  public addNewProductFormSidebar:boolean = false;
  public submitted:boolean = false;
  public statusOptions:any[] = [{name:'Active', value:true}, {name:'Inactive', value:false}];
  public successResponce:any[] = [];
  public loggedInUserName:string = '';
  public productDeleteLoading:boolean = false;
  public formTitle!:string;
  public formState!:string;

  public productForm:FormGroup = new FormGroup({
    id:new FormControl(''),
    product_name: new FormControl(''),
    product_code: new FormControl(''),
    status: new FormControl(''),
    comments: new FormControl(''),
    valid_till:new FormControl(''),
    product_sub_category:new FormControl(''),
    sub_category_id:new FormControl(''),
    product_category:new FormControl(''),
    //last_updated_by_id:new FormControl('')
  });

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public fb: FormBuilder) { }

    deviceActionMenuItems!:MenuItem[];

  ngOnInit(): void {
    this.backUrl = this.appConfig.urlDeviceManagement;
    this.selectedSubCategory = this._aRoute.snapshot.params?.['subId'];
    //this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Device Management','url':this.appConfig.urlDeviceManagement, 'disabled':true}, {'name':'Add New Product','url':'', 'disabled':true});
    this.setProductForm();
    this.getProducts(this.selectedSubCategory);
    this.getSubCategoryDetails(this.selectedSubCategory);
    const userData:any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loggedInUserName = userData.user_details.username
  }

  setProductForm(){
    this.productForm = this.fb.group({
      id:[''],
      product_name: ['', [Validators.required]],
      product_code: [''],
      status:['', [Validators.required]],
      valid_till:['', [Validators.required]],
      comments:[''],
      product_sub_category:[''],
      product_category:[''],
      sub_category_id:[''],
      //last_updated_by_id:['']
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.productForm.controls;
  }

  getProducts(productCat:any) {
    this.productsLoader = true;
    const getProductCategory = {
      action: 'product/product/',
      method: 'get',
      params: {
        product_sub_category:productCat
      }
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
      this.breadcrumblist.push({'name':'Home','url':this.appConfig.urlHome, 'disabled':false}, {'name':'Device Management','url':this.appConfig.urlDeviceManagement, 'disabled':false}, {'name':this.productSubCategory.main_category_name, 'url':this.appConfig.urlDeviceManagement, 'disabled':false}, {'name':this.productSubCategory.sub_category, 'disabled':false}, {'name':'Device List', 'disabled':true});
      
      //this.productForm.get('last_updated_by_id')?.setValue(this.loggedInUserName)
      // if(this.productMainCategory && this.productSubCategory){
      //   const mainCategoryName = this.productMainCategory.category + '-' + this.productMainCategory.id;
      //   this.backUrl = this.appConfig.urlProductCategory + '/' + this.productMainCategory.id;
      //   this.breadcrumblist.push({'name':'Home','url':this.appConfig.urlHome, 'disabled':false}, {'name':'Product Categories','url':this.appConfig.urlProductCategory, 'disabled':false}, {'name':mainCategoryName, 'url':this.backUrl, 'disabled':false}, {'name':this.productSubCategory.sub_category, 'disabled':true});
      // }      
      console.log('productSubCategory', this.productSubCategory);
    })
  }

  addProduct(){
    this.submitted = true;
    console.log('this.productForm.invalid', this.productForm.invalid);
    if (this.productForm.invalid) {
      return;
    } 
    this.productForm.patchValue({
      valid_till: this.productForm.get('valid_till')?.value ? moment(this.productForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
      product_code:this.productForm.get('product_name')?.value,
      //last_updated_by_id: this.loggedInUserName
      //product_sub_category: this.productSubCategory.id,
      //product_category: this.productSubCategory.product_category,
      //confirmPassword:this.userForm.get('confirmPassword')?.disable()
    })
    //console.log(JSON.stringify(this.userForm.value));
    const setUser = {
        action: 'product/product/',
        method: this.formState == 'add'?'post':'put',
        data: this.productForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        //this.generateTestcasesLoader = false;        
        this.successResponce = result;
        console.log('successResponce', this.successResponce);
        if(!_.isEmpty(result)) {
          this.addNewProductFormSidebar = false;
          this.getProducts(this.selectedSubCategory);       
          if(this.formState == 'add'){
            this.messageService.add({severity:'success', summary:'Success', detail:'Device added successfully'});
          } else {
            this.messageService.add({severity:'success', summary:'Success', detail:'Device updated successfully'});
          }      
        }      
      }, error=>{
        console.log('error', error);
      })
    this.productForm.reset();
  }

  cancelBtn(){
    this.addNewProductFormSidebar = false;
  }


  showProductForm(){
    this.formTitle = 'Add New Device';
    this.formState = 'add';
    this.addNewProductFormSidebar = true;
    this.productForm.get('product_category')?.setValue(this.productSubCategory.product_category);
    this.productForm.get('product_sub_category')?.setValue(this.productSubCategory.id);
    this.productForm.get('sub_category_id')?.setValue(this.productSubCategory.id);
  }

  public seDeciveActionMenu(selectedProduct:any){
    console.log('selected Product', selectedProduct);
    this.deviceActionMenuItems = [{
      label: 'Actions',
      items: [{
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => {
              this.showUpdateForm(selectedProduct);
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => {
              this.delete(selectedProduct);
          }
      }
      ]}
    ];
  }

  delete(selectedProduct:any){    
    this.confirmationService.confirm({
      message: 'Do you want to delete this device?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //console.log('selectedUserId', userId);
        this.productDeleteLoading = true;
        const getUsers = {
          action: 'product/product/',
          method: 'delete',
          params: {
            id: selectedProduct.id
          }
        }
        this.dataService.apiDelegate(getUsers).subscribe((result: any) => {
          // if(!_.isEmpty(result)){        
          //     this.usersList = result;
          // }
          //this.deleteResponce = result.message;
          this.messageService.add({severity:'info', summary:'Confirmed', detail:result.message});
          this.getProducts(this.selectedSubCategory);         
          this.productDeleteLoading = false;
        }, error => {
          this.productDeleteLoading = false;
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

  showUpdateForm(selectedDevice:any){
    this.formTitle = 'Update Device';
    this.formState = 'edit';
    this.addNewProductFormSidebar = true;
    console.log('selectedDevice', selectedDevice);
    this.productForm.patchValue({
      id:selectedDevice.id,
      product_name: selectedDevice.product_name,
      product_code: selectedDevice.product_code,
      status:selectedDevice.status,
      valid_till:moment(selectedDevice.valid_till).format('YYYY-MM-DD'),
      comments:selectedDevice.comments,
      product_sub_category:selectedDevice.product_sub_category,
      product_category:selectedDevice.product_category,
      sub_category_id:selectedDevice.sub_category_id,
    })
  }

  update(){
    console.log('update')
  }

}
