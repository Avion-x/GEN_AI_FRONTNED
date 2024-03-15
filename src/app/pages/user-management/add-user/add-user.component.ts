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


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  providers: [MessageService]
})
export class AddUserComponent implements OnInit {
  public backUrl:string = '';
  public breadcrumblist:any[] = [];
  //public userForm!: FormGroup;
  public validateUserNameLoader:boolean = false;
  public userNameValidation:boolean = true;
  public userNameSubmitted:boolean = false;
  public usernameValue:string = '';
  public userNameDirty:boolean = false;
  public validateRegex:boolean = false;
  public formSubmitted:boolean = false;
  public rolesList:any[] = ['Admin', 'Test Admin', 'User']; 
  public booleanOptions:any[] = [{name:'Yes', value:true}, {name:'No', value:false}];
  public loggedInUserName:string = '';
  public successMessage!:Message[];
  public successResponcePopup: boolean = false;
  public successResponce:any;

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
    public fb: FormBuilder, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Users Management','url':this.appConfig.urlUsersList, 'disabled':false}, {'name':'Users List','url':this.appConfig.urlUsersList, 'disabled':false}, {'name':'Add New User','url':'', 'disabled':true});
    this.backUrl = this.appConfig.urlUsersList;
    this.setForm();
    const userData:any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loggedInUserName = userData.user_details.username
    //this.userForm.disable();
    //console.log('====', );   
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
      //confirmPassword:this.userForm.get('confirmPassword')?.disable()
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

  afterSuccess(){
    this.successResponcePopup=false;
    this.onReset();
    this.navigateToUsersList();
  }

}
