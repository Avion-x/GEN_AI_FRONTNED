import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import * as _ from 'lodash';
import {ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  providers: [ConfirmationService,MessageService]
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
  public deletionLoadiong:boolean = false;
  public deleteResponce:string = '';
  public deleteConformationDialog:boolean = false;

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    private _global: GlobalService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Users Management','url':'', 'disabled':true}, {'name':'Users List','url':'', 'disabled':true});
    this.backUrl = this.appConfig.urlHome;
    this.getUsers();
  }

  addNewUser(){

  }

  updateUser(selectedUser:any) {
    this._global.sendUserInfoToUpdate(selectedUser);
    const url = this.appConfig.urlUpdateUser + "/"+selectedUser.id;
    this._router.navigateByUrl(url);
  }

  showUserDetails(selectedUser:any) {
    this.showSidePannel = true;
    this.selectedUser = selectedUser;
    this.selectedUserId = selectedUser.username;
    console.log('selectedUser', this.selectedUser);
    const sidepanel = document.getElementById('sidePanelSection')?.classList;
    if(sidepanel?.contains('showSidePanel')) {
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

  deleteUser(userId:any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        console.log('selectedUserId', userId);
        this.deletionLoadiong = true;
        const getUsers = {
          action: 'users/',
          method: 'delete',
          params: {
            id: userId
          }
        }
        this.dataService.apiDelegate(getUsers).subscribe((result: any) => {
          console.log('delete user', result);
          // if(!_.isEmpty(result)){        
          //     this.usersList = result;
          // }
          this.deleteResponce = result.message;
          this.messageService.add({severity:'info', summary:'Confirmed', detail:result.message});
          this.showSidePannel = false;
          this.getUsers();          
          this.deletionLoadiong = false;
        }, error => {
          this.deletionLoadiong = false;
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

}
