import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import {MenuItem} from 'primeng/api';
import * as moment from 'moment';
import * as _ from 'lodash';
import {Message,MessageService} from 'primeng/api';

@Component({
  selector: 'app-test-cases-management',
  templateUrl: './test-cases-management.component.html',
  styleUrls: ['./test-cases-management.component.scss'],
  providers: [MessageService]
})
export class TestCasesManagementComponent implements OnInit {

  public breadcrumblist:any[] = [];
  public testTypesLoader:boolean = false;
  public backUrl:string = '';
  public testTypesData:any[] = [];
  public selectedTestType:any;
  public selectedTestId:string = '';
  public testTypeFormSidebar:boolean = false;
  public submitted:boolean = false;
  public statusOptions:any[] = [{name:'Active', value:true}, {name:'Inactive', value:false}];
  public mainActionMenuItems!: MenuItem[];
  public subActionMenuItems!: MenuItem[];
  public createTestCaseTypeLoader:boolean = true;
  public loggedInUserName:string = '';
  public testCategoryFormSidebar:boolean = false;
  public testCategoriesLoader:boolean = false;
  public testTypeCategories:any[] = [];
  public confirmDeletionPopup:boolean = false;
  public selectedTestCategoryToDelete:any;
  public testCategoryDeletionLoader:boolean = false;
  public testCategoryDetionSuccess:boolean = false;
  public testCategoryDetionMessage:string = '';

  testCategoryForm:FormGroup = new FormGroup({
    name: new FormControl(''),
    test_type: new FormControl(''),
    status: new FormControl(''),
    valid_till:new FormControl(''),
    description:new FormControl(''),
  });

  testTypeForm:FormGroup = new FormGroup({
    name: new FormControl(''),
    code: new FormControl(''),
    status: new FormControl(''),
    comments: new FormControl(''),
    valid_till:new FormControl(''),
    description:new FormControl(''),
    executable_codes:new FormControl(''),
    last_updated_by:new FormControl(''),
  });



  // public testTypeCategories:any[] = [
  //   {
  //     id:'TestCategory-000001',
  //     name:'Protocal Testing',
  //     code:'protocalTesting',
  //     created_by:'Rafi Shaik',
  //     created_at:'',
  //     is_approved:'yes',
  //     comments:''
  //   },
  //   {
  //     id:'TestCategory-000002',
  //     name:'Port Testing',
  //     code:'portTesting',
  //     created_by:'Rafi Shaik',
  //     created_at:'',
  //     is_approved:'yes',
  //     comments:''
  //   }
  // ] 

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    private messageService: MessageService,
    public fb: FormBuilder) { }

  ngOnInit(): void {
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Test Settings','url':'', 'disabled':true});
    this.backUrl = this.appConfig.urlTestCasesManagement;
    this.getTestTypes();
    this.setTestTypeForm();
    this.setTestCategoryForm();
    const userData:any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loggedInUserName = userData.user_details.username
  }

  setTestTypeForm(){
    this.testTypeForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      status:['', [Validators.required]],
      valid_till:['', [Validators.required]],
      comments:[''],
      description:[''],
      executable_codes:[''],
      last_updated_by:['']
    })
  }

  setTestCategoryForm(){
    this.testCategoryForm = this.fb.group({
      name: ['', [Validators.required]],
      test_type: ['', [Validators.required]],
      status:['', [Validators.required]],
      valid_till:['', [Validators.required]],
      description:[''],
      number_of_test_cases:['0']
    })
  }
 

  get fTestType(): { [key: string]: AbstractControl } {
    return this.testTypeForm.controls;
  }

  get fTestCat(): { [key: string]: AbstractControl } {
    return this.testCategoryForm.controls;
  }

  getTestTypes() {
    this.testTypesLoader = true;
    const getProductCategory = {
      action: 'product/testtypes/',
      method: 'get',
      // params: {
      //   id: productId
      // }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      //const testCases = result.data;   
      this.testTypesData = [...result.data]; 
      // testCases.forEach((item:any) => {
      //   this.testTypes.push(item.code)
      // });
      this.testTypesLoader = false;
      console.log('testTypes', this.testTypesData);
    })
  }

  showTestTypeForm(){
    this.testTypeFormSidebar = true;
  }
  
  createTestType(){
    this.submitted = true;
    if (this.testTypeForm.invalid) {
      return;
    }
    const scriptData = "python script in seperate file for each " + this.testTypeForm.get('name')?.value
    const executable_codes:any = {TestCases: {code: this.testTypeForm.get('code')?.value}, TestScripts: {code: scriptData}}
    this.testTypeForm.patchValue({
      //product_category:this.subCategoryForm.get('valid_till')?.value,
      valid_till: this.testTypeForm.get('valid_till')?.value ? moment(this.testTypeForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
      //last_updated_by:
      executable_codes: executable_codes,
      last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
      //confirmPassword:this.userForm.get('confirmPassword')?.disable()
    })
    //console.log(JSON.stringify(this.userForm.value));
    const setUser = {
        action: 'product/testtypes/',
        method: 'post',
        data: this.testTypeForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        this.createTestCaseTypeLoader = false;        
        //this.successResponce = result;
        //console.log('successResponce', result);
        if(!_.isEmpty(result)) {
          //this.afterSuccess();          
          this.messageService.add({severity:'success', summary:'Success', detail:'Test Type created successfully'});
          this.testTypeFormSidebar = false;
          this.getTestTypes();          
        }      
        //this.testScriptsData = responceData.TestScripts;
      }, error => {
        console.log('error',error);
        //this.productSubCategoryLoader = false;
      })
    this.testTypeForm.reset();
    this.submitted = false;
  }

  testTypeCancelBtn(){
    this.testTypeFormSidebar = false;
  }

  testCategoryCancelBtn(){
    this.testCategoryFormSidebar = false;
  }

  showCreateTestCategoryForm(){
    this.testCategoryFormSidebar=true;
    this.testCategoryForm.get('test_type')?.setValue(this.selectedTestId);
  }

  createTestCategory(){
    this.submitted = true;
    if (this.testCategoryForm.invalid) {
      return;
    }
    // const scriptData = "python script in seperate file for each " + this.testTypeForm.get('name')?.value
    // const executable_codes:any = {TestCases: {code: this.testTypeForm.get('code')?.value}, TestScripts: {code: scriptData}}
    this.testCategoryForm.patchValue({
      //product_category:this.subCategoryForm.get('valid_till')?.value,
      valid_till: this.testCategoryForm.get('valid_till')?.value ? moment(this.testCategoryForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
      //last_updated_by:
      //executable_codes: executable_codes,
      //last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
      //confirmPassword:this.userForm.get('confirmPassword')?.disable()
    })
    //console.log(JSON.stringify(this.userForm.value));
    const setUser = {
        action: 'product/test_categories/',
        method: 'post',
        data: this.testCategoryForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        this.createTestCaseTypeLoader = false;        
        //this.successResponce = result;
        //console.log('successResponce', result);
        if(!_.isEmpty(result)) {
          //this.afterSuccess();          
          this.messageService.add({severity:'success', summary:'Success', detail:'Test category created successfully'});
          this.testCategoryFormSidebar = false;
          this.getTestTypes();
        }      
        //this.testScriptsData = responceData.TestScripts;
      }, error => {
        console.log('error',error);
        //this.productSubCategoryLoader = false;
      })
    this.testCategoryForm.reset();
    this.submitted = false;
  }

  getTestTypeCategory(selecedTestType:string){
    this.selectedTestType = selecedTestType;
    this.selectedTestId = selecedTestType;
    this.testCategoriesLoader = true;
    const getProductCategory = {
      action: 'product/test_categories/',
      method: 'get',
      params: {
        test_type_id: selecedTestType
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      //const testCases = result.data;   
      this.testTypeCategories = [...result.data]; 
      // testCases.forEach((item:any) => {
      //   this.testTypes.push(item.code)
      // });
      this.testCategoriesLoader = false;
      console.log('testTypeCategories', this.testTypeCategories);
    })
  }

  public setTestTypeActionMenu(selectedProduct:any){
    console.log('selected Main Product', selectedProduct);
    this.mainActionMenuItems = [{
      label: 'Actions',
      items: [{
          label: 'Edit',
          icon: 'pi pi-pencil',
          disabled:true,
          command: () => {
              //this.update();
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          disabled:true,
          command: () => {
              //this.delete();
          }
      }
      ]}
  ];
  }

  public setTestCatActionMenu(selectedTestCategory:any){
    console.log('selected Test Category', selectedTestCategory);
    this.subActionMenuItems = [{
      label: 'Actions',
      items: [{
          label: 'Edit',
          icon: 'pi pi-pencil',
          disabled:true,
          command: () => {
              //this.update();
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          disabled:true,
          command: () => {
              this.deleteTestCategory(selectedTestCategory);
          }
      }
      ]}
  ];
  }

  deleteTestCategory(category:any){
    this.confirmDeletionPopup = true;
    this.selectedTestCategoryToDelete = category;   
    console.log('this.selectedTestCategoryToDelete -- Delete', this.selectedTestCategoryToDelete);
  }

  confirmDelete(){
    this.testCategoryDeletionLoader = true;
    const getProductCategory = {
      action: 'product/test_categories/',
      method: 'delete',
      params: {
        id: this.selectedTestCategoryToDelete.id
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      console.log('delete Result', result);
      this.testCategoryDeletionLoader = false;
      if(!_.isEmpty(result)) {
        this.testCategoryDetionSuccess = true;
        this.testCategoryDetionMessage = result.message;
      }
      //const testCases = result.data;   
      //this.testTypeCategories = [...result.data]; 
      // testCases.forEach((item:any) => {
      //   this.testTypes.push(item.code)
      // });
      //this.testCategoriesLoader = false;
     // console.log('testTypeCategories', this.testTypeCategories);
    },error=>{
      console.log('error', error);
    })
  }

  closeDeleteConformaion(){
    this.confirmDeletionPopup = false;
  }

}
