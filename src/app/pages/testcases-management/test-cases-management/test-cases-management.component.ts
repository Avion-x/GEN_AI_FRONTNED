import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import {MenuItem} from 'primeng/api';
import * as moment from 'moment';
import * as _ from 'lodash';
import {ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';

@Component({
  selector: 'app-test-cases-management',
  templateUrl: './test-cases-management.component.html',
  styleUrls: ['./test-cases-management.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class TestCasesManagementComponent implements OnInit {

  public breadcrumblist:any[] = [];
  public testTypesLoader:boolean = false;
  public backUrl:string = '';
  public testTypesData:any[] = [];
  public selectedTestType:any;
  public selectedTestId!:any;
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
  public testTypeDeletionLoader:boolean = false;
  public testCategoryDeletionLoader:boolean = false;
  public testCategoryDetionSuccess:boolean = false;
  public testCategoryDetionMessage:string = '';

  public testTypeFormState!:string;
  public testTypeFormTitle!:string;
  public testCategoryFormState!:string;
  public testCategoryFormTitle!:string;

  testCategoryForm:FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    test_type: new FormControl(''),
    status: new FormControl(''),
    valid_till:new FormControl(''),
    description:new FormControl(''),
  });

  testTypeForm:FormGroup = new FormGroup({
    id: new FormControl(''),
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
    private confirmationService: ConfirmationService,
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
      id:[''],
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
      id:[''],
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
    this.testTypeFormState = 'add';
    this.testTypeFormTitle = "Create New Test Type"
    this.testTypeFormSidebar = true;
  }
  
  createTestType(){
    this.submitted = true;
    if (this.testTypeForm.invalid) {
      return;
    }
    const scriptData = "python script in seperate file for each " + this.testTypeForm.get('name')?.value;
    const executable_codes:any = {TestCases: {code: this.testTypeForm.get('code')?.value}, TestScripts: {code: scriptData}}
    if(this.testTypeFormState == 'add'){
      this.testTypeForm.patchValue({
        //product_category:this.subCategoryForm.get('valid_till')?.value,
        valid_till: this.testTypeForm.get('valid_till')?.value ? moment(this.testTypeForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
        //last_updated_by:
        executable_codes: executable_codes,
        last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
        //confirmPassword:this.userForm.get('confirmPassword')?.disable()
      })
    } else {
      this.testTypeForm.patchValue({
        //product_category:this.subCategoryForm.get('valid_till')?.value,
        valid_till: this.testTypeForm.get('valid_till')?.value ? moment(this.testTypeForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
        //last_updated_by:
        //executable_codes: executable_codes,
        last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
        //confirmPassword:this.userForm.get('confirmPassword')?.disable()
      })
    }
    
    
    //console.log(JSON.stringify(this.userForm.value));
    const setUser = {
        action: 'product/testtypes/',
        method: this.testTypeFormState=='add'?'post':'put',
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
    this.testCategoryFormState = 'add';
    this.testCategoryFormTitle = "Create New Test Category";
    this.testCategoryForm.get('number_of_test_cases')?.setValue('0');
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
        method: this.testCategoryFormState == 'add'?'post':'put',
        data: this.testCategoryForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        this.createTestCaseTypeLoader = false;        
        //this.successResponce = result;
        //console.log('successResponce', result);
        if(!_.isEmpty(result)) {
          //this.afterSuccess();          
          if(this.testCategoryFormState == 'add'){
            this.messageService.add({severity:'success', summary:'Success', detail:'Test category created successfully'});
          } else {
            this.messageService.add({severity:'success', summary:'Success', detail:'Test category updated successfully'});
          }
          
          this.testCategoryFormSidebar = false;
          //this.getTestTypes();
          this.getTestTypeCategory(this.selectedTestType);
        }      
        //this.testScriptsData = responceData.TestScripts;
      }, error => {
        console.log('error',error);
        //this.productSubCategoryLoader = false;
      })
    this.testCategoryForm.reset();
    this.submitted = false;
  }

  getTestTypeCategory(selecedTestType:any) {
    if(this.selectedTestId == selecedTestType.id){
      this.selectedTestId = '';
      return
    }
    this.selectedTestType = selecedTestType;
    this.selectedTestId = selecedTestType.id;
    this.testCategoriesLoader = true;
    const getProductCategory = {
      action: 'product/test_categories/',
      method: 'get',
      params: {
        test_type_id: this.selectedTestId
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

  public setTestTypeActionMenu(selectedTestType:any){
    console.log('selectedTestType', selectedTestType);
    this.mainActionMenuItems = [{
      label: 'Actions',
      items: [{
          label: 'Edit',
          icon: 'pi pi-pencil',
          //disabled:true,
          command: () => {
              this.showUpdateTestType(selectedTestType);
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          //disabled:true,
          command: () => {
              this.deleteTestType(selectedTestType);
          }
      }
      ]}
  ];
  }

  showUpdateTestType(selectedTestType:any){
    this.testTypeFormState = 'edit';
    this.testTypeFormTitle = "Update Test Type"
    this.testTypeFormSidebar = true;
    this.testTypeForm.patchValue({
      id:selectedTestType.id,
      name: selectedTestType.name,
      code: selectedTestType.code,
      status:selectedTestType.status,
      valid_till:moment(selectedTestType.valid_till).format('YYYY-MM-DD'),
      comments:selectedTestType.comments,
      description:selectedTestType.description,
      executable_codes:selectedTestType.executable_codes,
      //last_updated_by:selectedTestType.last_updated_by
    })
  }

  deleteTestType(selectedTestType:any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //console.log('selectedUserId', userId);
        this.testTypeDeletionLoader = true;
        const getUsers = {
          action: 'product/testtypes/',
          method: 'delete',
          params: {
            id: selectedTestType.id
          }
        }
        this.dataService.apiDelegate(getUsers).subscribe((result: any) => {
          console.log('delete user', result);
          // if(!_.isEmpty(result)){        
          //     this.usersList = result;
          // }
          //this.testCategoryDetionMessage = result.message;
          this.messageService.add({severity:'info', summary:'Confirmed', detail:result.message});
          this.testCategoryFormSidebar = false;
          this.getTestTypes();          
          this.testTypeDeletionLoader = false;
        }, error => {
          this.testTypeDeletionLoader = false;
          //console.log('error',error);
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

  public setTestCatActionMenu(selectedTestCategory:any){
    console.log('selected Test Category', selectedTestCategory);
    this.subActionMenuItems = [{
      label: 'Actions',
      items: [{
          label: 'Edit',
          icon: 'pi pi-pencil',
          //disabled:true,
          command: () => {
              this.showUpdateTestCategory(selectedTestCategory);
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          //disabled:true,
          command: () => {
              this.deleteTestCategory(selectedTestCategory);
          }
      }
      ]}
    ];
  }

  showUpdateTestCategory(selectedTestCategory:any){
    this.testCategoryFormState = 'edit';
    this.testCategoryFormTitle = "Update Test Category";
    this.testCategoryFormSidebar=true;
    this.testCategoryForm.patchValue({
      id:selectedTestCategory.id,
      name: selectedTestCategory.name,
      test_type: selectedTestCategory.test_type,
      status:selectedTestCategory.status,
      valid_till:moment(selectedTestCategory.valid_till).format('YYYY-MM-DD'),
      description:selectedTestCategory.description,
      number_of_test_cases:selectedTestCategory.number_of_test_cases
    })
  }

  deleteTestCategory(selectedTestCategory:any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //console.log('selectedUserId', userId);
        this.testCategoryDeletionLoader = true;
        const getUsers = {
          action: 'product/test_categories/',
          method: 'delete',
          params: {
            id: selectedTestCategory.id
          }
        }
        this.dataService.apiDelegate(getUsers).subscribe((result: any) => {
          console.log('delete user', result);
          // if(!_.isEmpty(result)){        
          //     this.usersList = result;
          // }
          this.testCategoryDetionMessage = result.message;
          this.messageService.add({severity:'info', summary:'Confirmed', detail:result.message});
          this.testCategoryFormSidebar = false;
          this.getTestTypeCategory(this.selectedTestType);          
          this.testCategoryDeletionLoader = false;
        }, error => {
          this.testCategoryDeletionLoader = false;
          //console.log('error',error);
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

  // deleteTestCategory(category:any){
  //   this.confirmDeletionPopup = true;
  //   this.selectedTestCategoryToDelete = category;   
  //   console.log('this.selectedTestCategoryToDelete -- Delete', this.selectedTestCategoryToDelete);
  // }

  // confirmDelete(){
  //   this.testCategoryDeletionLoader = true;
  //   const getProductCategory = {
  //     action: 'product/test_categories/',
  //     method: 'delete',
  //     params: {
  //       id: this.selectedTestCategoryToDelete.id
  //     }
  //   }
  //   this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
  //     console.log('delete Result', result);
  //     this.testCategoryDeletionLoader = false;
  //     if(!_.isEmpty(result)) {
  //       this.testCategoryDetionSuccess = true;
  //       this.testCategoryDetionMessage = result.message;
  //     }
  //     //const testCases = result.data;   
  //     //this.testTypeCategories = [...result.data]; 
  //     // testCases.forEach((item:any) => {
  //     //   this.testTypes.push(item.code)
  //     // });
  //     //this.testCategoriesLoader = false;
  //    // console.log('testTypeCategories', this.testTypeCategories);
  //   },error=>{
  //     console.log('error', error);
  //   })
  // }

  // closeDeleteConformaion(){
  //   this.confirmDeletionPopup = false;
  // }

}
