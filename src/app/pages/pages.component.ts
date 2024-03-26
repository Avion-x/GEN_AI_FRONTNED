import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {MenuItem} from 'primeng/api';
import { AppConfigService } from '../shared/services/app-config.service';
import { AuthService } from '../shared/services/auth.service';
import { DataService } from '../shared/services/data.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  userMenuItems!:MenuItem[];
  items!: MenuItem[];
  public navList:any[]=[];
  public currentUser:any;
  public userTag:string = '';
  public userMenuActiveState: boolean = false;
  public showClientLogo:boolean = true;
  public userDetailsMenu:boolean = false;

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private appConfig:AppConfigService) {
      // this.currentUser = {};
      // this.authenticationService.user.subscribe((user:any) => this.currentUser = user.user_details);
      // if(this.currentUser){
      //   this.userTag = this.currentUser.first_name.charAt(0)+this.currentUser.last_name.charAt(0);
      // }      
      // console.log(' this.userTag',  this.currentUser);
      // console.log('currentUser', this.currentUser);
      
    }

  ngOnInit(): void {
    this.navList = [];
    const userData:any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('----userData', userData);
    if(!_.isEmpty(userData)){
      this.currentUser = userData.user_details;
      console.log('----userData--', userData.token);
      if(this.currentUser){
          this.userTag = this.currentUser.first_name.charAt(0)+this.currentUser.last_name.charAt(0);
      }      
      console.log(' this.userTag',  this.currentUser);
      console.log('currentUser', this.currentUser);

      if(this.currentUser.role_name.toLowerCase() === 'superadmin'){
        this.showClientLogo = false;
        this.navList = [
          {
            'name':'Dashboard',
            'icon':'dashboard',
            'url':this.appConfig.urlDashboard
          },
          {
            'name':'Enterprise Management',
            'icon':'category',
            'url':this.appConfig.urlEnterpriseManagement
          },
        ]
      } else if (this.currentUser.role_name.toLowerCase() == 'admin'){
        this.navList = [
          {
            'name':'Dashboard',
            'icon':'dashboard',
            'url':this.appConfig.urlDashboard
          },
          {
            'name':'Test Management',
            'icon':'bug_report',
            'url':this.appConfig.urlTestCaseManagement
          },
          {
            'name':'Test Settings',
            'icon':'psychology',
            'url':this.appConfig.urlTestCasesManagement
          },
          {
            'name':'Device Management',
            'icon':'router',
            'url':this.appConfig.urlDeviceManagement
          },          
          {
            'name':'User Management',
            'icon':'manage_accounts',
            'url':this.appConfig.urlUsersList
          },
        ]
      } else if (this.currentUser.role_name.toLowerCase() === 'user'){
        this.navList = [
          {
            'name':'Dashboard',
            'icon':'dashboard',
            'url':this.appConfig.urlDashboard
          },
          {
            'name':'Test Execution',
            'icon':'bug_report',
            'url':this.appConfig.urlTestCaseManagement
          },
          {
            'name':'Test Settings',
            'icon':'psychology',
            'url':this.appConfig.urlTestCasesManagement
          },
        ]
      }
    }

    this.items = [
      {label: 'New', icon: 'pi pi-fw pi-plus'},
      {label: 'Open', icon: 'pi pi-fw pi-download'},
      {label: 'Undo', icon: 'pi pi-fw pi-refresh'}
    ];

    this.userMenuItems = [{
      //label: 'Logout',
      items: [{
          label: 'Logout',
          icon: 'pi pi-power-off',
          command: () => {
              this.logout();
          }
      }
      ]},
      
  ];

    

  }

  showUserDetails(){
    this.userDetailsMenu = !this.userDetailsMenu;
  }

  hideUserMenu(){
    this.userDetailsMenu = false;
  }

  logout() {
    //this.productsLoader = true; 
    //localStorage.removeItem('currentUser');  
    this.authenticationService.logout();
    // let currentUrl = 'login';
    // this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //     this._router.navigate([currentUrl]);
    // });
    //this.authenticationService.logout();
    // const hitLogout = {
    //   action: 'logout',
    //   method: 'get',
    //   // params: {
    //   //   unixid: this.userLogged
    //   // }
    // }
    // this.dataService.apiDelegate(hitLogout).subscribe((result: any) => {
    //   //this.productCategoryData = result;
    //   //this.productsLoader = false;
    //   console.log('logout', result);      
    // });   
    this._router.navigateByUrl('login');
  }

  userMenuToggle(){
    this.userMenuActiveState = !this.userMenuActiveState;
  }

}
