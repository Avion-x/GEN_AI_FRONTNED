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
  public readytoTestDevicesLoader:boolean=false;

  public readyToTestDevices:any[] = []

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,) { }

  ngOnInit(): void {
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Test Management','url':'', 'disabled':true});
    this.backUrl = this.appConfig.urlHome;
    this.getProducts();
    this.getTestTypes();
    this.getProductsCat();
    this.getReadyToTestDevices();
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

  getReadyToTestDevices() {
    this.readyToTestDevices = [];
    this.readytoTestDevicesLoader = true;
    const getProductCategory = {
      action: 'product/product/',
      method: 'get',
      params: {
        test_types_available:true
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.readyToTestDevices = result.data;
      this.readytoTestDevicesLoader = false;
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
    const url = this.appConfig.urlTestCaseManagement + '/'+ selectedProduct.main_category_id + '/' + selectedProduct.product_sub_category + '/products/' + selectedProduct.id;
    console.log('url', url)
    this._router.navigateByUrl(url);
  }


  checkboxSelected(){
    console.log('selectedTestTypes', this.selectedTestTypes);
  }
  

}
