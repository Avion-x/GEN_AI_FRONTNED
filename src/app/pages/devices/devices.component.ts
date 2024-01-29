import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

//import { DataService } from 'src/app/shared/services/data.service';


@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  public currentUser:any;
  public productCategoryData:any[] = [];
  public showMainCategory:boolean = false;
  public selectedMainCategory:any;
  public selectedSubCategory:any;

  public productSubCategoryData:any[] = [];

  public breadcrumblist:any[] = [];

  public productsLoader:boolean = false;
  public productSubCategoryLoader:boolean = false;
 
  public backUrl:string = '';

  public showSubCat:boolean=false;
  public selectedRowId:string = '';
  public selectedProductId:string = '';


  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    private el: ElementRef) { 
    this.authenticationService.user.subscribe(user => this.currentUser = user);
    console.log('currentUser', this.currentUser)
  }

  ngOnInit(): void {
    //this.clearRoutePath();
    this.selectedMainCategory = this._aRoute.snapshot.params?.['mainID'];
    this.getProductsCat();
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Product Categories','url':'', 'disabled':true});
    this.showMainCategory = true;
    this.backUrl = this.appConfig.urlHome;
    if(this.selectedMainCategory){
      this.getProductsSubCategory(this.selectedMainCategory);
    }
    //this.getProductsSubCategory();
    //this.getProducts();
  }



  getProductsCat(){
    this.productsLoader = true;
    const getProductCategory = {
      action: 'product/productcategory/',
      method: 'get',
      // params: {
      //   unixid: this.userLogged
      // }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.productCategoryData = result;
      this.productsLoader = false;
      //console.log('this.productCategoryData', this.productCategoryData);
    })
  }

  // clearRoutePath(){
  //   const url = 'home/devices';
  //   this._router.navigateByUrl(url);
  // }

  navigateToSubCategory(selectedCategory:any){
    const url = 'home/productCategories/'+selectedCategory;
    this._router.navigateByUrl(url);
  }


  getProductsSubCategory(selectedproduct:any){    
    this.navigateToSubCategory(selectedproduct)
    this.selectedMainCategory = selectedproduct;
    this.productSubCategoryLoader = true;
    this.productSubCategoryData=[];
    //this.selectedRowId = 'tableExpantion'+selectedproduct;
    //this.selectedProductId = selectedproduct;
    //console.log('this.selectedRowId', this.selectedRowId);
    // const selectedElement = document.getElementById('tableExpantion'+selectedproduct);
    // let myTag = this.el.nativeElement.querySelector(".expantionPanel");
    // if(myTag.classList.contains('show'))
    // {
    //     myTag.classList.remove('show'); 
    // }
    // selectedElement?.classList.add('show');



   // console.log('productCat')
    //this.selectedMainCategory = selectedproduct
    // const url = 'home/devices/'+this.selectedMainCategory;
    // this._router.navigateByUrl(url);

   
    const getProductCategory = {
      action: 'product/productsubcategory/',
      method: 'get',
      params: {
        product_category: selectedproduct
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.productSubCategoryData = result.data;
      this.productSubCategoryLoader = false;
      //console.log('productSubCategoryData', this.productSubCategoryData);
    })
  }

  navigateToProducts(selectedMainCat:any, selectedSubCat:any){
    this.selectedMainCategory = selectedMainCat;
    this.selectedSubCategory = selectedSubCat;
    const url = 'home/productCategories/'+this.selectedMainCategory + '/' + this.selectedSubCategory + '/products';
    console.log('url', url)
    this._router.navigateByUrl(url);
  }

  

}
