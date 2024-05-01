import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import {ConfirmationService, ConfirmEventType, Message, MessageService} from 'primeng/api';

@Component({
  selector: 'app-git-config',
  templateUrl: './git-config.component.html',
  styleUrls: ['./git-config.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class GitConfigComponent implements OnInit {

  public backUrl:string = '';
  public breadcrumblist:any[] = [];
  public gitHubConfigLoader:boolean = false;
  public gitHubConfigData:any[] = [];
  public gitHubConfigurationFormSidebar:boolean = false;
  githubForm: FormGroup = new FormGroup({
    access_key:new FormControl(''),
    repository: new FormControl(''),
    branch: new FormControl(''),
    // status: new FormControl(''),
    valid_till:new FormControl(''),
  });
  public submitted:boolean = false;
  public successResponce:any;
  public successMessage!:Message[];
  public successResponcePopup: boolean = false;
  public submitSuccessMessage:string ='';
  public gitHubFormTitle:string = 'Create GitHub Configuration';
  public loggedInUserDetails:any;
  public gitOperation:any;
  public gitData:any;
  public responceDialogTitle:string = '';
  public statusOptions:any[] = [{name:'ACTIVE', value:'ACTIVE'}, {name:'INACTIVE', value:"INACTIVE"}];


  constructor(private authenticationService:AuthService,
    private dataService:DataService,
    private _router: Router,
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    public fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    const userData:any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loggedInUserDetails = userData.user_details;
    console.log('----userData', this.loggedInUserDetails);

    this.backUrl = this.appConfig.urlGitConfig;
    this.breadcrumblist.push(
          {'name':'Home','url':this.appConfig.urlHome, 'disabled':false},
          {'name':' GitHub Configuration','url':'', 'disabled':true})
    this.getGitConfigs();
  }

  getGitConfigs(){
    this.gitHubConfigLoader = true;
    const getProductCategory = {
        action: 'git_details/',
        method: 'get',
        // params: {
        //   id: productId
        // }
      }
      this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
        this.gitHubConfigData = result.data;
        this.gitData = result.data.data
        this.gitHubConfigLoader = false;
        // this.enterpriseList = result.data;
        console.log('get GitCongigs', result);

    }, error => {
      this.gitHubConfigLoader = false;
      console.log('error',error);
    })
  }

  showAddNewCongigSideBar(){
    this.gitHubConfigurationFormSidebar = true;
  }

  hideConfigurationSideBar(){
    this.gitHubConfigurationFormSidebar = false;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.githubForm.controls;
  }

  setForm(){
    this.githubForm = this.fb.group({
      access_key: ['', [Validators.required]],
      repository:['', [Validators.required]],
      branch: ['', [Validators.required]],
      // status: ['', [Validators.required]],
      valid_till: ['', [Validators.required]]
    })
    //this.githubForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  submitData() {
    console.log('this.githubForm.invalid', this.githubForm.invalid);
    console.log('this.githubForm.value', this.githubForm.value);
    if (this.githubForm.invalid) {
      return;
    }
    this.submitted = true;
    this.githubForm.patchValue({
      //valid_till: this.enterpriseForm.get('valid_till')?.value ? moment(this.enterpriseForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
      //last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
      //confirmPassword:this.enterpriseForm.get('confirmPassword')?.disable(),
      id:this.loggedInUserDetails.id
    })
    //console.log(JSON.stringify(this.enterpriseForm.value));
    const setUser = {
        action: 'git_details/',
        method: 'post',
        data: this.githubForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        //this.generateTestcasesLoader = false;
        this.successResponce = result;
        console.log('successResponce', this.successResponce);
        if(result.success) {
          this.gitHubConfigurationFormSidebar = false;
          this.submitSuccessMessage = result.success;
          this.successResponcePopup = true;
          this.submitted = false;
          this.responceDialogTitle = 'Success'
          this.githubForm.reset();
          //this.afterSuccess();
          //this.messageService.add({severity:'success', summary:'Success', detail:'User added successfully'});
          //this.messageService.add({severity:'success', summary: 'Success', detail: 'User added successfully'});
          //const responceData = result.response.Regression;
          //this.testCasesData = responceData.TestCases;
          this.getGitConfigs();
        }
        else{
          this.gitHubConfigurationFormSidebar = false;
          this.responceDialogTitle = 'Error';
          this.submitSuccessMessage = result.error;
          this.successResponcePopup = true;
          this.submitted = false;
        }
        //this.testScriptsData = responceData.TestScripts;
      })
  }

  afterSuccess(){
    this.successResponcePopup=false;
    //this.onReset();
    //this.navigateToEnterpriseList();
  }

  setActive(selectedRepo:any){
    console.log('selectedRepo', selectedRepo);
    
    this.confirmationService.confirm({
      message: 'Are you sure that you want to change the repository?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',      
      accept: () => {
          //this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
          const changeRepo = {
            "id": selectedRepo.id,
            "status": "ACTIVE"
          }
          const setActive = {
            action: 'git_config_status/',
            method: 'put',
            data: changeRepo
          }
          this.dataService.apiDelegate(setActive).subscribe((result: any) => {
            console.log('result',result);
            if(result.status == 200){
              this.confirmationService.confirm({
                header: 'Success',
                icon:'pi pi-check-circle',
                message: result.success,
                rejectVisible:false,
                acceptLabel:'Ok',
                accept: () => {
                    //Actual logic to perform a confirmation
                    this.getGitConfigs();
                }
              });
              
            }
          }, error=>{
            console.log('error',error);
          });
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

}
