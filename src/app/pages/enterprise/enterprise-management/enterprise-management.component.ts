import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import {MenuItem} from 'primeng/api';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import {ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';

@Component({
  selector: 'app-enterprise-management',
  templateUrl: './enterprise-management.component.html',
  styleUrls: ['./enterprise-management.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class EnterpriseManagementComponent implements OnInit {

  public backUrl:string = '';
  public breadcrumblist:any[] = [];
  public enterpriseList:any[] =[];
  public enterpriseListLoader:boolean = false;
  public actionMenuItems!: MenuItem[];
  public deletionLoadiong:boolean = false;
  public deleteResponce:string = '';
  public deleteConformationDialog:boolean = false;

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.backUrl = this.appConfig.urlHome;
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false},{'name':'Enterprise Mangement','url':'', 'disabled':true});
    this.getEnterproceList();
    // this.enterpriseList = [
    // {
    //   id:1,
    //   logo:'https://juniper-prod.scene7.com/is/image/junipernetworks/juniper_black-rgb-header?wid=200&dpr=off',
    //   name:'juniper',
    //   created_at:'01-01-2024',
    //   created_by:'rafi',
    //   valid_till:'31-01-2030',
    //   comments:''
    // },
    // {
    //   id:2,
    //   logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/324px-Cisco_logo_blue_2016.svg.png',
    //   name:'Cisco',
    //   created_at:'01-01-2024',
    //   created_by:'rafi',
    //   valid_till:'31-01-2030',
    //   comments:''
    // },
    // {
    //   id:3,
    //   logo:'https://www.wipro.com/content/dam/nexus/staticsites/homepage/header/Wipro_Primary%20Logo_Color_RGB.svg',
    //   name:'Wipro',
    //   created_at:'01-01-2024',
    //   created_by:'rafi',
    //   valid_till:'31-01-2030',
    //   comments:''
    // }
    // ]
  }

  public navigateToAddNewEnterprise(){
    const url = this.appConfig.urlAddNewEnterprise;
    this._router.navigateByUrl(url);
  }

  getEnterproceList(){    
    this.enterpriseListLoader = true;
    const getProductCategory = {
        action: 'customers/',
        method: 'get',
        // params: {
        //   id: productId
        // }
      }
      this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
        this.enterpriseListLoader = false;
        this.enterpriseList = result;    
        console.log('enterpriseList', this.enterpriseList);

    })
  }

  public setActionMenu(selectedMainCategory:any){
    console.log('selectedMainCategory', selectedMainCategory);
    this.actionMenuItems = [{
      label: 'Actions',
      items: [
      {
          label: 'Edit',
          icon: 'pi pi-pencil',
          //disabled: true,
          command: () => {
              this.updateUser(selectedMainCategory);
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          //disabled: true,
          command: () => {
            this.deleteUser(selectedMainCategory.id);
          }
      }
      ]}
    ];
  }

  deleteUser(enterpriseId:any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        console.log('selected EnterpriseId', enterpriseId);
        this.deletionLoadiong = true;
        const getUsers = {
          action: 'customers/',
          method: 'delete',
          params: {
            id: enterpriseId
          }
        }
        this.dataService.apiDelegate(getUsers).subscribe((result: any) => {
          console.log('delete user', result);
          // if(!_.isEmpty(result)){        
          //     this.usersList = result;
          // }
          this.deleteResponce = result.message;
          this.messageService.add({severity:'info', summary:'Confirmed', detail:result.message});
          //this.showSidePannel = false;
          this.getEnterproceList();          
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

  updateUser(selectedUser:any) {
    //this._global.sendUserInfoToUpdate(selectedUser);
    const url = this.appConfig.urlUpdateEnterprise + "/"+selectedUser.id;
    this._router.navigateByUrl(url);
  }

}
