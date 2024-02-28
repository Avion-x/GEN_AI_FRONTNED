import { Component, OnInit } from '@angular/core';
import { flush } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-test-device-list',
  templateUrl: './test-device-list.component.html',
  styleUrls: ['./test-device-list.component.scss']
})
export class TestDeviceListComponent implements OnInit {

  public breadcrumblist:any[] = [];
  public backUrl:string = '';
  public deviceListLoader:boolean=false;
  public tabActiveIndex: number = 0;
  public confirmTestTypeDialog:boolean=false;

  public productsData:any[] = [];
  public productsLoader:boolean = false;

  public testTypes:any[] = [];
  public generateTestCasesModal:boolean = false;

  public selectedDevice:any;
  public dialogTitle:string = '';
  public selectedTestTypes:any[] = [];
  public selectedDeviceTestTypes:any[] = [];

  public productCategoryData:any[] = [];
  public productCatrgorysLoader:boolean = false;

  public selectedMainCategory:any;
  public productSubCategoryLoader:boolean = false;
  public productSubCategoryData:any[] = [];
  public showSubCategoryFilter:boolean = false;

  public selectedMainCategoryId:string = '';
  public selectedSubCategoryId:string = '';

  public readyToTestDevices:any[] = [
    {
        "id": 5,
        "sub_category_name": "M series",
        "category_name": "router",
        "customer_name": "Juniper",
        "product_code": "MX480",
        "status": true,
        "valid_till": "2025-12-14",
        "comments": "This is Juniper router",
        "created_at": "2023-12-14T18:30:00Z",
        "last_updated_at": "2023-12-14T18:30:00Z",
        "customer": 3,
        "test_types":[{
          "id": 1,
          "name": "",
          "code": "UNIT TEST",
          "description": "unit test",
          "status": true,
          "valid_till": null,
          "comments": "",
          "created_at": null,
          "last_updated_at": null,
          "last_updated_by": "",
          "executable_codes": {
            "TestCases": {
              "code": "Unit Test"
            },
            "TestScripts": {
              "code": "python script in seperate file for each Unit test"
            }
          }
        },
        {
          "id": 2,
          "name": "",
          "code": "Regression",
          "description": "Regression Test",
          "status": true,
          "valid_till": "2023-12-21",
          "comments": "This is regression test f",
          "created_at": "2023-12-15T18:30:00Z",
          "last_updated_at": "2024-01-05T18:30:00Z",
          "last_updated_by": "Avion-x",
          "executable_codes": {
            "TestCases": {
              "code": "Regression Test"
            },
            "TestScripts": {
              "code": "python script in seperate file for each Regression test"
            }
          }
        }],
        "product_sub_category": 2,
        "last_updated_by": 2
    },
    {
        "id": 6,
        "sub_category_name": "M series",
        "category_name": "router",
        "customer_name": "Juniper",
        "product_code": "MX481",
        "status": true,
        "valid_till": "2025-12-15",
        "comments": "This is Juniper router",
        "created_at": "2023-12-15T18:30:00Z",
        "last_updated_at": "2023-12-15T18:30:00Z",
        "customer": 3,
        "test_types":[{
          "id": 1,
          "name": "",
          "code": "UNIT TEST",
          "description": "unit test",
          "status": true,
          "valid_till": null,
          "comments": "",
          "created_at": null,
          "last_updated_at": null,
          "last_updated_by": "",
          "executable_codes": {
            "TestCases": {
              "code": "Unit Test"
            },
            "TestScripts": {
              "code": "python script in seperate file for each Unit test"
            }
          }
        }],
        "product_sub_category": 2,
        "last_updated_by": 7
    }
  ]

  public allDevices:any[] = [
      {
        "id": 1,
        "sub_category_name": "R series",
        "category_name": "router",
        "customer_name": "Juniper",
        "product_code": "MX251",
        "status": true,
        "valid_till": "2025-12-15",
        "comments": "This is Juniper router",
        "created_at": "2023-12-15T18:30:00Z",
        "last_updated_at": "2023-12-15T18:30:00Z",
        "customer": 3,
        "test_types":[],
        "product_sub_category": 2,
        "last_updated_by": 7
      },
      {
        "id": 2,
        "sub_category_name": "R series",
        "category_name": "router",
        "customer_name": "Juniper",
        "product_code": "MX268",
        "status": true,
        "valid_till": "2025-12-15",
        "comments": "This is Juniper router",
        "created_at": "2023-12-15T18:30:00Z",
        "last_updated_at": "2023-12-15T18:30:00Z",
        "customer": 3,
        "test_types":[],
        "product_sub_category": 2,
        "last_updated_by": 7
    },
    {
        "id": 5,
        "sub_category_name": "M series",
        "category_name": "router",
        "customer_name": "Juniper",
        "product_code": "MX480",
        "status": true,
        "valid_till": "2025-12-14",
        "comments": "This is Juniper router",
        "created_at": "2023-12-14T18:30:00Z",
        "last_updated_at": "2023-12-14T18:30:00Z",
        "customer": 3,
        "test_types":[{
          "id": 1,
          "name": "",
          "code": "UNIT TEST",
          "description": "unit test",
          "status": true,
          "valid_till": null,
          "comments": "",
          "created_at": null,
          "last_updated_at": null,
          "last_updated_by": "",
          "executable_codes": {
            "TestCases": {
              "code": "Unit Test"
            },
            "TestScripts": {
              "code": "python script in seperate file for each Unit test"
            }
          }
        },
        {
          "id": 2,
          "name": "",
          "code": "Regression",
          "description": "Regression Test",
          "status": true,
          "valid_till": "2023-12-21",
          "comments": "This is regression test f",
          "created_at": "2023-12-15T18:30:00Z",
          "last_updated_at": "2024-01-05T18:30:00Z",
          "last_updated_by": "Avion-x",
          "executable_codes": {
            "TestCases": {
              "code": "Regression Test"
            },
            "TestScripts": {
              "code": "python script in seperate file for each Regression test"
            }
          }
        }],
        "product_sub_category": 2,
        "last_updated_by": 2
    },
    {
        "id": 6,
        "sub_category_name": "M series",
        "category_name": "router",
        "customer_name": "Juniper",
        "product_code": "MX481",
        "status": true,
        "valid_till": "2025-12-15",
        "comments": "This is Juniper router",
        "created_at": "2023-12-15T18:30:00Z",
        "last_updated_at": "2023-12-15T18:30:00Z",
        "customer": 3,
        "test_types":[{
          "id": 1,
          "name": "",
          "code": "UNIT TEST",
          "description": "unit test",
          "status": true,
          "valid_till": null,
          "comments": "",
          "created_at": null,
          "last_updated_at": null,
          "last_updated_by": "",
          "executable_codes": {
            "TestCases": {
              "code": "Unit Test"
            },
            "TestScripts": {
              "code": "python script in seperate file for each Unit test"
            }
          }
        }],
        "product_sub_category": 2,
        "last_updated_by": 7
    }
  ]

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,) { }

  ngOnInit(): void {
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Test Execution','url':'', 'disabled':true});
    this.backUrl = this.appConfig.urlHome;
    this.getProducts();
    this.getTestTypes();
    this.getProductsCat();
  }

  public showTestDialog(selectedDevice:any){
    this.generateTestCasesModal = false;
    this.selectedDevice = selectedDevice;
    this.selectedDeviceTestTypes = selectedDevice.test_types;
    console.log('this.selectedDevice', this.selectedDevice);
    this.dialogTitle = selectedDevice.product_code;
    this.confirmTestTypeDialog = true;
  }

  showGenerateTestcasesDialog(selectedDevice:any){
    this.generateTestCasesModal = true;
    this.selectedDevice = selectedDevice;
    this.selectedDeviceTestTypes = this.testTypes;
    console.log('this.selectedDeviceTestTypes', this.selectedDeviceTestTypes);
    console.log('this.testTypes', this.testTypes);
    this.dialogTitle = selectedDevice.product_code;
    this.confirmTestTypeDialog = true;
  }

  onFiltering(event: any) {
    console.log('-------------',event)
    console.log('Filtered value: '+ JSON.stringify(event.filters));
  }

  selectedFilter(event:any){
    console.log('------selectedFilter-------',event)
  }

  getProducts() {
    this.productsData = [];
    this.productsLoader = true;
    const getProductCategory = {
      action: 'product/product/',
      method: 'get',
      // params: {
      //   product_category: 3
      // }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.productsData = result.data;
      this.productsLoader = false;
      console.log('Product List', this.productsData);
    })
  }

  getTestTypes() {
    const getProductCategory = {
      action: 'product/testtypes/',
      method: 'get',
      // params: {
      //   id: productId
      // }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      //const testCases = result.data;   
      this.testTypes = [...result.data]; 
      // testCases.forEach((item:any) => {
      //   this.testTypes.push(item.code)
      // });
      console.log('testTypes', this.testTypes);
    })
  }


  getProductsCat(){
    if(!_.isEmpty(this.productSubCategoryData)){
      this.showSubCategoryFilter = true;
    }
    this.productCatrgorysLoader = true;
    const getProductCategory = {
      action: 'product/productcategory/',
      method: 'get',
      // params: {
      //   unixid: this.userLogged
      // }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.productCategoryData = result;
      this.productCatrgorysLoader = false;
      console.log('this.productCategoryData', this.productCategoryData);
    }, error => {
      console.log('error', error);
      this.productCatrgorysLoader = false;
    })
  }

  getProductsSubCategory(selectedCategory:any){    
    console.log('selectedproduct', selectedCategory);
    this.selectedMainCategory = _.filter(this.productCategoryData, {category: selectedCategory});
    console.log('selectedMainCategory', this.selectedMainCategory);
    this.productSubCategoryLoader = true;
    this.productSubCategoryData=[];  
    const getProductCategory = {
      action: 'product/productsubcategory/',
      method: 'get',
      params: {
        product_category: this.selectedMainCategory[0].id
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.productSubCategoryData = result.data;
      this.productSubCategoryLoader = false;      
      console.log('productSubCategoryData', this.productSubCategoryData);
      if(!_.isEmpty(this.productSubCategoryData)){
        this.showSubCategoryFilter = true;
      }
    })
  }

  navigateToProductDetails(selectedProduct:any){
    console.log('selectedProduct', selectedProduct);
    const url = this.appConfig.urlTestCaseManagement + '/'+ selectedProduct.main_category_id + '/' + selectedProduct.sub_category_id + '/products/' + selectedProduct.id;
    console.log('url', url)
    this._router.navigateByUrl(url);
  }
  

}
