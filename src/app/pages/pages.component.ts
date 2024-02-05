import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {MenuItem} from 'primeng/api';
import { AppConfigService } from '../shared/services/app-config.service';
import { AuthService } from '../shared/services/auth.service';
import { DataService } from '../shared/services/data.service';

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

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private appConfig:AppConfigService) {
      this.authenticationService.user.subscribe((user:any) => this.currentUser = user.user_details);
      if(this.currentUser){
        this.userTag = this.currentUser.first_name.charAt(0)+this.currentUser.last_name.charAt(0);
      }      
      console.log(' this.userTag',  this.currentUser);
      console.log('currentUser', this.currentUser);
     }

  ngOnInit(): void {
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

    this.navList = [
      {
        'name':'Products',
        'icon':'category',
        'url':this.appConfig.urlProductCategory
      },
      {
        'name':'Test Execution',
        'icon':'bug_report',
        'url':this.appConfig.urlTestExecution
      },
      {
        'name':'Device Management',
        'icon':'router',
        'url':this.appConfig.urlDeviceManagement
      },
      {
        'name':'Testcases Settings',
        'icon':'psychology',
        'url':this.appConfig.urlTestCasesManagement
      },
      {
        'name':'User Management',
        'icon':'manage_accounts',
        'url':this.appConfig.urlUsersList
      },
    ]

  }

  logout(){
    //this.productsLoader = true;   
    this._router.navigateByUrl('login');
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
      
    // })
  }

}
