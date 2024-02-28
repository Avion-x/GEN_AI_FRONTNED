import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-enterprise-management',
  templateUrl: './enterprise-management.component.html',
  styleUrls: ['./enterprise-management.component.scss']
})
export class EnterpriseManagementComponent implements OnInit {

  public backUrl:string = '';
  public breadcrumblist:any[] = [];
  public enterpriseList:any[] =[];

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,) { }

  ngOnInit(): void {
    this.backUrl = this.appConfig.urlHome;
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false},{'name':'Enterprise Mangement','url':'', 'disabled':true});
    this.enterpriseList = [
    {
      id:1,
      logo:'https://juniper-prod.scene7.com/is/image/junipernetworks/juniper_black-rgb-header?wid=200&dpr=off',
      name:'juniper',
      created_at:'01-01-2024',
      created_by:'rafi',
      valid_till:'31-01-2030',
      comments:''
    },
    {
      id:2,
      logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/324px-Cisco_logo_blue_2016.svg.png',
      name:'Cisco',
      created_at:'01-01-2024',
      created_by:'rafi',
      valid_till:'31-01-2030',
      comments:''
    },
    {
      id:3,
      logo:'https://www.wipro.com/content/dam/nexus/staticsites/homepage/header/Wipro_Primary%20Logo_Color_RGB.svg',
      name:'Wipro',
      created_at:'01-01-2024',
      created_by:'rafi',
      valid_till:'31-01-2030',
      comments:''
    }
    ]
  }

  public navigateToAddNewEnterprise(){
    const url = this.appConfig.urlAddNewEnterprise;
    this._router.navigateByUrl(url);
  }

}
