import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Validation from './passwordMatchValidation';
import {DropdownModule} from 'primeng/dropdown';
import { ImageCroppedEvent, LoadedImage, ImageTransform, Dimensions } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import * as _ from 'lodash';
import {Message,MessageService} from 'primeng/api';
import { GlobalService } from 'src/app/shared/services/global.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  providers: [MessageService]
})
export class AddUserComponent implements OnInit {
  public backUrl:string = '';
  public breadcrumblist:any[] = [];
  public pageTitle!:string;
  public subTitle!:string;
  public formTitle!:string;
  //public userForm!: FormGroup;
  public validateUserNameLoader:boolean = false;
  public userNameValidation:boolean = true;
  public userNameSubmitted:boolean = false;
  public usernameValue:string = '';
  public userNameDirty:boolean = false;
  public validateRegex:boolean = false;
  public formSubmitted:boolean = false;
  public rolesList:any[] = ['ADMIN', 'TEST_ADMIN', 'USER']; 
  public booleanOptions:any[] = [{name:'Yes', value:true}, {name:'No', value:false}];
  public loggedInUserName:string = '';
  public successMessage!:Message[];
  public successResponcePopup: boolean = false;
  public successResponce:any;
  public selectedUserToUpdate:any;
  public loadingUserData:boolean = false;
  public userData:any;
  public formState!:string;
  public isValueChanged:boolean = false;

  selectedFile!: File;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation?: number;
  translateH = 0;
  translateV = 0;
  scale = 1;
  aspectRatio = 4 / 3;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {
    translateUnit: 'px'
  };
  imageURL?: string;
  loading = false;
  allowMoveImage = false;
  hidden = false;


  userForm: FormGroup = new FormGroup({
    id:new FormControl(''),
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    role_name:new FormControl(''),
    is_active:new FormControl(''),
    is_staff:new FormControl(''),
    valid_till:new FormControl(''),
    comments:new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    avatar:new FormControl(''),
    last_updated_by:new FormControl('')
    //acceptTerms: new FormControl(false),
  });
  submitted:boolean = false;

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private _global: GlobalService,
    public fb: FormBuilder, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // this._global.userUpdateInfo.subscribe((user:any) =>{
    //   this.selectedUserToUpdate = user;
    //   if(!_.isEmpty(user)){
    //     this.getUsersDetails(user.id);
    //   }      
    // });
    this.formState = this._aRoute.snapshot.params?.['formState'];
    if(this.formState == 'editUser') {
      this.selectedUserToUpdate = this._aRoute.snapshot.params?.['id'];
      if(!_.isEmpty(this.selectedUserToUpdate)) {
            this.getUsersDetails(this.selectedUserToUpdate);
      } 
      this.pageTitle = 'Update User';
      this.subTitle ='Edit existing user information';
      this.formTitle = 'Edit user info';
      this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Users Management','url':this.appConfig.urlUsersList, 'disabled':false}, {'name':'Users List','url':this.appConfig.urlUsersList, 'disabled':false}, {'name':'Update User','url':'', 'disabled':true});
    } else {
      this.pageTitle = 'Add New User';
      this.subTitle ='Creating new user';
      this.formTitle = 'Create New User';
      this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Users Management','url':this.appConfig.urlUsersList, 'disabled':false}, {'name':'Users List','url':this.appConfig.urlUsersList, 'disabled':false}, {'name':'Add New User','url':'', 'disabled':true});
    }
    
    console.log('this.selectedUserToUpdate', this.selectedUserToUpdate);
    
    this.backUrl = this.appConfig.urlUsersList;
    this.setForm();
    const userData:any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loggedInUserName = userData.user_details.username;
    //this.userForm.disable();
    //console.log('====', );   
  }

  getUsersDetails(selectedUser:any) {
    this.loadingUserData = true;
    const getUsers = {
      action: 'users/',
      method: 'get',
      params: {
        id: selectedUser
      }
    }
    this.dataService.apiDelegate(getUsers).subscribe((result: any) => {
      console.log('getUsers', result);
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
      //this.userForm.get('confirmPassword').clearValidators();
      if(!_.isEmpty(result)){        
          this.userData = result[0];
          this.userForm.patchValue({
            id: this.userData.id,
            first_name:this.userData.first_name,
            last_name:this.userData.last_name,
            username:this.userData.username,
            email:this.userData.email,
            role_name:this.userData.role_name,
            is_active:this.userData.is_active,
            is_staff:this.userData.is_staff,
            valid_till:moment(this.userData.valid_till).format('YYYY-MM-DD'),
            comments:this.userData.comments,
            password:this.userData.password,
            confirmPassword:this.userData.password,
            avatar:this.userData.avatar,
            last_updated_by:this.loggedInUserName
          });
          console.log('selected User to update:', result);
          // this.userForm.get('id')?.setValue( this.userData.id);
          // this.userForm.get('first_name')?.setValue( this.userData.first_name);
          // this.userForm.get('last_name')?.setValue( this.userData.last_name);
          // this.userForm.get('username')?.setValue( this.userData.username);
          // this.userForm.get('email')?.setValue( this.userData.email);
          // this.userForm.get('role_name')?.setValue( this.userData.role_name);
          // this.userForm.get('is_active')?.setValue( this.userData.is_active);
          // this.userForm.get('is_staff')?.setValue( this.userData.is_staff);
          // this.userForm.get('valid_till')?.setValue(moment(this.userData.valid_till).format('YYYY-MM-DD'));
          // this.userForm.get('comments')?.setValue( this.userData.comments);;
          // this.userForm.get('password')?.setValue( this.userData.password);
          // this.userForm.get('confirmPassword')?.setValue( this.userData.password);
          // this.userForm.get('avatar')?.setValue( this.userData.avatar);
          //this.userForm.get('last_updated_by')?.setValue( this.userData.last_updated_by);
      }
      console.log('this.userForm', this.userForm.value);
      this.loadingUserData = false;
      this.isValueChanged = false;
    }, error => {
      this.loadingUserData = false;
      console.log('error',error);
    })
  }

  setForm(){
    // this.userForm = this.fb.group({
    //   username:['', [Validators.required]],
    //   first_name: ['', [Validators.required]],
    //   last_name:['', [Validators.required]],
    //   email:['', [Validators.required]],
    //   role_name:['', [Validators.required]],      
    //   password:['', [Validators.required]],
    //   confirmPassword:['', [Validators.required]],
    //   is_active:['', [Validators.required]],
    //   is_staff:['', [Validators.required]],
    //   valid_till:['', [Validators.required]],
    //   comments:['', [Validators.required]]      
    // })
    this.userForm = this.formBuilder.group(
      {
        id:[''],
        first_name: ['', [Validators.required]],
        last_name:['', [Validators.required]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        role_name:['', [Validators.required]],
        is_active:['', [Validators.required]],
        is_staff:['', [Validators.required]],
        valid_till:['', [Validators.required]],
        comments:[''], 
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required],        
        avatar:[''],
        last_updated_by:['']
        //acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );
    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  // get f(): { [key: string]: AbstractControl } {
  //   return this.userForm.controls;
  // }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }


  validateRegularExpression(){
    const regularExpression = /^(?!^[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,20}$/;
    this.validateRegex = regularExpression.test(this.usernameValue);
    if(!this.validateRegex && this.usernameValue ==''){
      this.userForm.disable();
    }
    if(this.usernameValue ==''){
      
    }
  }

  showDate(){
    console.log('--------------',this.userForm.value)
  }

  validateUserName(){
    //const selectedUsername = this.usernameValue   
    console.log('--validateRegex--', this.validateRegex);
    // Does not start with a number.
    // Contains at least one letter.
    // Contains only alphanumeric characters (letters and digits).
    // Is between 8 and 20 characters in length.
    if(this.validateRegex){
      this.userNameDirty = false;      
      this.validateUserNameLoader = true;
      if(this.usernameValue) {
        console.log('username---', this.usernameValue);
        const getUsers = {
          action: 'check_username/',
          method: 'get',
          params: {
            username: this.usernameValue
          }
        }
        this.dataService.apiDelegate(getUsers).subscribe((result: any) => {
          
          console.log('validate User Rsult', result);
          this.userNameValidation = result.does_exist;
          this.userNameSubmitted = true;
          if(this.userNameValidation == false){
            this.userForm.get('username')?.setValue(this.usernameValue);
            this.userForm.get('password')?.enable();
            this.userForm.enable();
          }
          // if(!_.isEmpty(result)){        
          //     this.usersList = result;
          // }
          this.validateUserNameLoader = false;
        }, error => {
          this.validateUserNameLoader = false;
          console.log('error',error);
        })
      }
    } else {
      //this.userNameDirty = false;       
    }
  }

  fileChangeEvent(event: any): void {
    console.log('event', event);
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    console.log('ImageCroppedEvent', event);
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl || event.base64 || '');
    //this.userForm.get('avatar')?.setValue(this.croppedImage.changingThisBreaksApplicationSecurity)
    console.log('this.croppedImage', this.croppedImage);
    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {
      // show cropper
  }
  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
    //this.loading = false;
  }
  loadImageFailed() {
      // show message
  }

  // onFileSelected(event:any): void {
  //   this.selectedFile = event.target.files[0];
  //   console.log('this.selectedFile', this.selectedFile);
  //   const image = this.userForm.get('avatar')?.value;
  //   console.log('avatar', image);
  // }
  navigateToUsersList(){
    const url = this.appConfig.urlUsersList;
    this._router.navigateByUrl(url);
  }

  onReset(): void {
    this.submitted = false;
    this.userForm.reset();
  }




  submitData() {
    this.successResponcePopup = true;
    this.submitted = true;
    console.log('this.userForm.invalid', this.userForm.invalid);
    if (this.userForm.invalid) {
      return;
    } 
    this.userForm.patchValue({
      valid_till: this.userForm.get('valid_till')?.value ? moment(this.userForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
      last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
      confirmPassword:this.userForm.get('confirmPassword')?.disable(),
      id:this.userForm.get('id')?.disable()
    })
    //console.log(JSON.stringify(this.userForm.value));
    const setUser = {
        action: 'users/',
        method: 'post',
        data: this.userForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        //this.generateTestcasesLoader = false;        
        this.successResponce = result;
        console.log('successResponce', this.successResponce);
        if(!_.isEmpty(result)) {
          this.afterSuccess();          
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

  updateUser(){    
    console.log('updateData', this.userForm.value);
    this.successResponcePopup = true;
    this.submitted = true;    
    //this.userData.get('password').updateValueAndValidity();

    console.log('this.userForm.invalid', this.userForm.invalid);
    if (this.userForm.invalid) {
      return;
    } 
    this.userForm.patchValue({
      valid_till: this.userForm.get('valid_till')?.value ? moment(this.userForm.get('valid_till')?.value).format('YYYY-MM-DD') : '',
      //last_updated_by: this.loggedInUserName ? this.loggedInUserName : '',
      confirmPassword:this.userForm.get('confirmPassword')?.disable(),
      //password:this.userForm.get('password')?.disable()
    })
    //console.log(JSON.stringify(this.userForm.value));
    const setUser = {
        action: 'users/',
        method: 'put',
        data: this.userForm.value
      }
      this.dataService.apiDelegate(setUser).subscribe((result: any) => {
        //this.generateTestcasesLoader = false;        
        this.successResponce = result;
        console.log('successResponce', this.successResponce);
        if(!_.isEmpty(result)) {
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
    this.navigateToUsersList();
  }

}
