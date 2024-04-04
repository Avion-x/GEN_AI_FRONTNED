import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import {Message,MessageService} from 'primeng/api';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-new-enterprise',
  templateUrl: './add-new-enterprise.component.html',
  styleUrls: ['./add-new-enterprise.component.scss'],
  providers: [MessageService]
})
export class AddNewEnterpriseComponent implements OnInit {

  public backUrl:string = '';
  public pageTitle:string = '';
  public subTitle:string = '';
  public formTitle:string = '';
  public breadcrumblist:any[] = [];
  public formState!:string;
  public isValueChanged:boolean = false;
  public successMessage!:Message[];
  public successResponcePopup: boolean = false;
  public successResponce:any;
  public loggedInUserName:string = '';
  public loadingEnterpriseData:boolean = false;
  public selectedEnterpriseIdToUpdate:string = '';
  public submitSuccessMessage:string = '';
  //public enterpriseForm!: FormGroup;
  public statusOptions:any[] = [{name:'Active', value:true}, {name:'Inactive', value:false}];
  enterpriseForm: FormGroup = new FormGroup({
    code:new FormControl(''),
    name: new FormControl(''),
    address: new FormControl(''),
    status: new FormControl(''),
    email: new FormControl(''),    
    valid_till:new FormControl(''),
    comments:new FormControl(''),    
    last_updated_by:new FormControl('')
    //acceptTerms: new FormControl(false),
  });
  submitted:boolean = false;

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    public fb: FormBuilder) { }

  ngOnInit(): void {
    this.formState = this._aRoute.snapshot.params?.['formState'];
    if(this.formState == 'editEnterprise') {
      this.selectedEnterpriseIdToUpdate = this._aRoute.snapshot.params?.['id'];
      if(!_.isEmpty(this.selectedEnterpriseIdToUpdate)) {
            this.getEnterpriseDetails(this.selectedEnterpriseIdToUpdate);
      } 
      this.pageTitle = 'Update Enterprise';
      this.subTitle ='Edit Existing Enterprise details';
      this.formTitle = 'Edit Enterprise details';
      this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Enterprise Management','url':this.appConfig.urlEnterpriseManagement, 'disabled':true}, {'name':'Update New Enterprise','url':'', 'disabled':true});
    } else {
      this.pageTitle = 'Add New Enterprise';
      this.subTitle ='Add new Enterprise';
      this.formTitle = 'Add New Enterprise';
      this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Enterprise Management','url':this.appConfig.urlEnterpriseManagement, 'disabled':true}, {'name':'Add New Enterprise','url':'', 'disabled':true});
    }
    this.backUrl = this.appConfig.urlEnterpriseManagement;
    //this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Enterprise Management','url':this.appConfig.urlEnterpriseManagement, 'disabled':true}, {'name':'Add New Enterprise','url':'', 'disabled':true});
    this.setForm();
    const userData:any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loggedInUserName = userData.user_details.username;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.enterpriseForm.controls;
  }

  setForm(){
    this.enterpriseForm = this.fb.group({
      code: ['', [Validators.required]],
      name:['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address:['', [Validators.required]],      
      status:['', [Validators.required]],      
      valid_till:['', [Validators.required]],
      last_updated_by:[''],
      comments:['']
    })
    this.enterpriseForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  submitData() {
    console.log('this.enterpriseForm.invalid', this.enterpriseForm.invalid);
    console.log('this.enterpriseForm.value', this.enterpriseForm.value);
    if (this.enterpriseForm.invalid) {
      return;
    } 
    this.submitted = true;
    this.enterpriseForm.patchValue({
      valid_till: this.enterpriseForm.get('valid_till')?.value ? moment(this.enterpriseForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
      last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
      //confirmPassword:this.enterpriseForm.get('confirmPassword')?.disable(),
      id:this.enterpriseForm.get('id')?.disable()
    })
    //console.log(JSON.stringify(this.enterpriseForm.value));
    const setUser = {
        action: 'customers/',
        method: 'post',
        data: this.enterpriseForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        //this.generateTestcasesLoader = false;        
        this.successResponce = result;
        console.log('successResponce', this.successResponce);
        if(!_.isEmpty(result)) {
          this.submitSuccessMessage = 'Enterprise created successfully';
          this.successResponcePopup = true;
          this.submitted = false;
          //this.afterSuccess();          
          //this.messageService.add({severity:'success', summary:'Success', detail:'User added successfully'});
          //this.messageService.add({severity:'success', summary: 'Success', detail: 'User added successfully'});          
          //const responceData = result.response.Regression;
          //this.testCasesData = responceData.TestCases;
        }      
        //this.testScriptsData = responceData.TestScripts;
      })
  }

  onValueChanged(data:any){
    console.log('onValueChange', data);
    this.isValueChanged = true;
  }

  updateEnterprise(){    
    console.log('updateData', this.enterpriseForm.value);
    
       
    //this.userData.get('password').updateValueAndValidity();

    console.log('this.enterpriseForm.invalid', this.enterpriseForm.invalid);
    if (this.enterpriseForm.invalid) {
      return;
    } 
    this.submitted = true; 
    this.enterpriseForm.patchValue({
      valid_till: this.enterpriseForm.get('valid_till')?.value ? moment(this.enterpriseForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
      //last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
      //confirmPassword:this.enterpriseForm.get('confirmPassword')?.disable(),
      //password:this.enterpriseForm.get('password')?.disable()
    })
    //console.log(JSON.stringify(this.enterpriseForm.value));
    const setUser = {
        action: 'customers/',
        method: 'put',
        data: this.enterpriseForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        //this.generateTestcasesLoader = false;        
        this.successResponce = result;
        console.log('successResponce', this.successResponce);
        if(!_.isEmpty(result)) {
          this.submitSuccessMessage = 'Enterprise updated successfully';
          this.successResponcePopup = true;
          this.submitted = false;
          this.afterSuccess();          
          //this.messageService.add({severity:'success', summary:'Success', detail:'User added successfully'});
          //this.messageService.add({severity:'success', summary: 'Success', detail: 'User added successfully'});          
          //const responceData = result.response.Regression;
          //this.testCasesData = responceData.TestCases;
        }      
        //this.testScriptsData = responceData.TestScripts;
      })
  }

  afterSuccess(){
    this.successResponcePopup=false;
    this.onReset();
    this.navigateToEnterpriseList();
  }

  navigateToEnterpriseList(){
    const url = this.appConfig.urlEnterpriseManagement;
    this._router.navigateByUrl(url);
  }

  onReset(): void {
    this.submitted = false;
    this.enterpriseForm.reset();
  }

  getEnterpriseDetails(selectedEnterprise:any) {
    this.loadingEnterpriseData = true;
    const getUsers = {
      action: 'customers/',
      method: 'get',
      params: {
        id: selectedEnterprise
      }
    }
    this.dataService.apiDelegate(getUsers).subscribe((result: any) => {
      //console.log('getUsers', result);      
      //this.userForm.get('confirmPassword').clearValidators();
      if(!_.isEmpty(result)){        
        const filteredData:any = _.filter(result, {id:parseInt(selectedEnterprise)});
        console.log('id:', selectedEnterprise, 'filteredData', filteredData);
        const enterpriseData = filteredData[0];
          this.enterpriseForm.patchValue({
            code: enterpriseData.code,
            name:enterpriseData.name,
            email:enterpriseData.email,
            address:enterpriseData.address,      
            status:enterpriseData.status,      
            valid_till:moment(enterpriseData.valid_till).format('YYYY-MM-DD'),
            last_updated_by:this.loggedInUserName,
            comments:enterpriseData.comments
          });
          console.log('selected Enterprise to update:', result);
      }
      console.log('this.enterpriseForm', this.enterpriseForm.value);
      this.loadingEnterpriseData = false;
      this.isValueChanged = false;
    }, error => {
      this.loadingEnterpriseData = false;
      console.log('error',error);
    })
  }

}
