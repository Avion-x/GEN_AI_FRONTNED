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

  items!: MenuItem[];
  public navList:any[]=[];

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private appConfig:AppConfigService) { }

  ngOnInit(): void {
    this.items = [
      {label: 'New', icon: 'pi pi-fw pi-plus'},
      {label: 'Open', icon: 'pi pi-fw pi-download'},
      {label: 'Undo', icon: 'pi pi-fw pi-refresh'}
    ];

    this.navList = [
      {
        'name':'Products',
        'icon':'category',
        'url':this.appConfig.urlProductCategory
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
    ]

  }

}
