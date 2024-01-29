import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-product-sub-category',
  templateUrl: './product-sub-category.component.html',
  styleUrls: ['./product-sub-category.component.scss']
})
export class ProductSubCategoryComponent implements OnInit {
  public currentUser:any;
  public productSubCategoryData:any[] = [];

  public breadcrumblist:any[] = [];

  public selectedMainCategory:any;
  public selectedSubCategory:any;
  public productsLoader:boolean = false;

  public productMainCategory:any;
  public backUrl:string = '';

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService) {
    // this.authenticationService.user.subscribe(user => this.currentUser = user);
    // console.log('currentUser', this.currentUser)
   }

  ngOnInit(): void {
    this.selectedMainCategory = this._aRoute.snapshot.params?.['mainID'];
    //console.log('this.selectedMainCategory', this.selectedMainCategory);
    if(this.selectedMainCategory){
      this.getProductsSubCategory(this.selectedMainCategory);
      this.getMainCategoryDetails(this.selectedMainCategory);
    }
  }

  getProductsSubCategory(selectedproduct:any){
    this.productsLoader = true;
    console.log('productCat')
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
      this.productsLoader = false;
      //console.log('productSubCategoryData', this.productSubCategoryData);
    })
  }

  getMainCategoryDetails(productId:any){
    const getProductCategory = {
      action: 'product/productcategory/',
      method: 'get',
      params: {
        id: productId
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.productMainCategory = result[0];    
      const mainCategoryName = this.productMainCategory.category + '-' + this.productMainCategory.id;
      this.backUrl = this.appConfig.urlProductCategory;
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Product Categories', 'url':this.appConfig.urlProductCategory, 'disabled':false}, {'name':mainCategoryName, 'disabled':true});  
      console.log('productMainCategory', this.productMainCategory);
    })
  }

  navigateToProducts(selectedSubCat:any){
    this.selectedSubCategory = selectedSubCat;
    const url = 'home/productCategories/'+this.selectedMainCategory + '/' + this.selectedSubCategory + '/products';
    console.log('url', url)
    this._router.navigateByUrl(url);
  }

}
