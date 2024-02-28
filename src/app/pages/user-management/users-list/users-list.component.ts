import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  public backUrl:string = '';
  public breadcrumblist:any[] = [];
  public usersListLoader:boolean = false;
  public showSidePannel:boolean = false;
  public selectedUser:any;
  public userTagName:string  = '';
  public selectedUserId:string = '';
  public loadingUsersList:boolean = false;
  public usersList:any[] = [];
  // public usersList:any[] = [
  //   {
  //     avatar:'',
  //     fullname:'Anju Goel',
  //     email:'anju@avion-x.com',
  //     username:'anjug',
  //     permissions:'Super Admin',
  //   },
  //   {
  //     avatar:'',
  //     fullname:'Deepak Agrawal',
  //     email:'deepak@avion-x.com',
  //     username:'deepaka',
  //     permissions:'Super Admin',
  //   },
  //   {
  //     avatar:'../../../../assets/avatars/premalatha.webp',
  //     fullname:'Premalatha Nair',
  //     email:'Premanair@avion-x.com',
  //     username:'muraleep',
  //     permissions:'Admin',
  //   },
  //   {
  //     avatar:'../../../../assets/avatars/rafi.webp',
  //     fullname:'Rafi Shaik',
  //     email:'rafi@avion-x.com',
  //     username:'rafis5',
  //     permissions:'Admin',
  //   },
  //   {
  //     avatar:'../../../../assets/avatars/abdullah.webp',
  //     fullname:'Abdullah Shaik',
  //     email:'abdullah@avion-x.com',
  //     username:'shaikm3',
  //     permissions:'Admin',
  //   },
  //   {
  //     avatar:'',
  //     fullname:'Damodar Reddy',
  //     email:'Damodar@avion-x.com',
  //     username:'damodar',
  //     permissions:'Admin',
  //   },
  //   {
  //     avatar:'../../../../assets/avatars/priyabrata.webp',
  //     fullname:'Priyabrata Parhi',
  //     email:'priyabrata@avion-x.com',
  //     username:'parhip',
  //     permissions:'Admin',
  //   },
  //   {
  //     avatar:'../../../../assets/avatars/harsha.webp',
  //     fullname:'Sree Harsha Bhardwaj',
  //     email:'harsha@avion-x.com',
  //     username:'sreehars',
  //     permissions:'User',
  //   },
  //   {
  //     avatar:'../../../../assets/avatars/dinesh.webp',
  //     fullname:'Dinesh Vemuri',
  //     email:'dinesh@avion-x.com',
  //     username:'chandv10',
  //     permissions:'User',
  //   },
  //   {
  //     avatar:'../../../../assets/avatars/prem.webp',
  //     fullname:'Prem Kumar',
  //     email:'prem@avion-x.com',
  //     username:'rsp1',
  //     permissions:'User',
  //   },
  //   {
  //     avatar:'../../../../assets/avatars/venkaiah.webp',
  //     fullname:'Venkaiah Valluru',
  //     email:'venkaiah@avion-x.com',
  //     username:'valluruv',
  //     permissions:'User',
  //   },
  //   {
  //     avatar:'',
  //     fullname:'Shubham Ramapure',
  //     email:'shubham@avion-x.com',
  //     username:'shubham',
  //     permissions:'User',
  //   }
  // ]

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,) { }

  ngOnInit(): void {
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Users Management','url':'', 'disabled':true}, {'name':'Users List','url':'', 'disabled':true});
    this.backUrl = this.appConfig.urlHome;
    this.getUsers();
  }

  addNewUser(){

  }

  showUserDetails(selectedUser:any){
    this.showSidePannel = true;
    this.selectedUser = selectedUser;
    this.selectedUserId = selectedUser.username;
    console.log('selectedUser', this.selectedUser);
    const sidepanel = document.getElementById('sidePanelSection')?.classList;
    if(sidepanel?.contains('showSidePanel')){
      sidepanel.remove('showSidePanel');
    } else {
      sidepanel?.add('showSidePanel');
    }
  }

  closeSidePanel(){
    this.showSidePannel = false;
    this.selectedUserId = '';
    const sidepanel = document.getElementById('sidePanelSection')?.classList;
    if(sidepanel?.contains('showSidePanel')){
      sidepanel.remove('showSidePanel');
    } else {
      sidepanel?.add('showSidePanel');
    }
  }

  // setTagName(userFullName:string){
  //   const nameArr = userFullName.split(' ');
  //   const tagName = nameArr[0].charAt(0) + nameArr[1].charAt(0);
  //   return tagName;
  // }

  setTagName(firstName:string, lastName:string){
    //const nameArr = userFullName.split(' ');
    const tagName = firstName.charAt(0) + lastName.charAt(0);
    return tagName;
  }

  navigateToAddUser(){
    const url = this.appConfig.urlAddUser;
    this._router.navigateByUrl(url);
  }

  getUsers() {
    this.loadingUsersList = true;
    const getUsers = {
      action: 'users/',
      method: 'get',
      // params: {
      //   ordering: '-id'
      // }
    }
    this.dataService.apiDelegate(getUsers).subscribe((result: any) => {
      console.log('getUsers', result);
      if(!_.isEmpty(result)){        
          this.usersList = result;
      }
      this.loadingUsersList = false;
    }, error => {
      this.loadingUsersList = false;
      console.log('error',error);
    })
  }

}
