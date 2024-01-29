import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-test-cases-management',
  templateUrl: './test-cases-management.component.html',
  styleUrls: ['./test-cases-management.component.scss']
})
export class TestCasesManagementComponent implements OnInit {

  public breadcrumblist:any[] = [];
  public testTypesLoader:boolean = false;
  public backUrl:string = '';
  public testTypesData:any[] = [];
  public selectedTestType:any;
  public selectedTestId:string = '';

  mainActionMenuItems!: MenuItem[];
  subActionMenuItems!:MenuItem[];

  public testTypeCategories:any[] = [
    {
      id:'TestCategory-000001',
      name:'Protocal Testing',
      code:'protocalTesting',
      created_by:'Rafi Shaik',
      created_at:'',
      is_approved:'yes',
      comments:''
    },
    {
      id:'TestCategory-000002',
      name:'Port Testing',
      code:'portTesting',
      created_by:'Rafi Shaik',
      created_at:'',
      is_approved:'yes',
      comments:''
    }
  ] 

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,) { }

  ngOnInit(): void {
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Testcases Settings','url':'', 'disabled':true});
    this.backUrl = this.appConfig.urlTestCasesManagement;
    this.getTestTypes();
  }

  getTestTypes() {
    this.testTypesLoader = true;
    const getProductCategory = {
      action: 'product/testtypes/',
      method: 'get',
      // params: {
      //   id: productId
      // }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      //const testCases = result.data;   
      this.testTypesData = [...result.data]; 
      // testCases.forEach((item:any) => {
      //   this.testTypes.push(item.code)
      // });
      this.testTypesLoader = false;
      console.log('testTypes', this.testTypesData);
    })
  }

  addNewTestType(){
    
  }

  showCreateTestCategory(selectedTestType:string){

  }

  getTestTypeCategory(selecedTestType:string){
    this.selectedTestType = selecedTestType;
    this.selectedTestId = selecedTestType;
  }

  public setTestTypeActionMenu(selectedProduct:any){
    console.log('selected Main Product', selectedProduct);
    this.mainActionMenuItems = [{
      label: 'Actions',
      items: [{
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => {
              //this.update();
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => {
              //this.delete();
          }
      }
      ]}
  ];
  }

  public setTestCatActionMenu(selectedSubProduct:any){
    console.log('selected Sub Product', selectedSubProduct);
    this.subActionMenuItems = [{
      label: 'Actions',
      items: [{
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => {
              //this.update();
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => {
              //this.delete();
          }
      }
      ]}
  ];
  }

}
