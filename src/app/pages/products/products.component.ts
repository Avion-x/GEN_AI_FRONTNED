import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public productsData:any[] = [];
  public breadcrumblist:any[] = [];
  public productsLoader:boolean = false;
  public selectedMainCategory:string = '';
  public selectedSubCategory:string = '';

  public productMainCategory:any;
  public productSubCategory:any;     
  public backUrl:string = '';

  constructor(private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService) { 

  }

  ngOnInit(): void {
    this.selectedMainCategory = this._aRoute.snapshot.params?.['mainID'];
    this.selectedSubCategory = this._aRoute.snapshot.params?.['subID'];
    console.log('this.selectedMainCategory', this.selectedMainCategory);
    this.getProducts('');
    this.getMainCategoryDetails(this.selectedMainCategory);
    this.getSubCategoryDetails(this.selectedSubCategory);
     
  }

  getProducts(productCat:any) {
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
      console.log('productMainCategory', this.productMainCategory);
    })
  }

  getSubCategoryDetails(productId:any){
    const getProductCategory = {
      action: 'product/productsubcategory/',
      method: 'get',
      params: {
        id: productId
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.productSubCategory = result.data[0]; 
      if(this.productMainCategory && this.productSubCategory){
        const mainCategoryName = this.productMainCategory.category + '-' + this.productMainCategory.id;
        this.backUrl = this.appConfig.urlProductCategory + '/' + this.productMainCategory.id;
        this.breadcrumblist.push({'name':'Home','url':this.appConfig.urlHome, 'disabled':false}, {'name':'Product Categories','url':this.appConfig.urlProductCategory, 'disabled':false}, {'name':mainCategoryName, 'url':this.backUrl, 'disabled':false}, {'name':this.productSubCategory.sub_category, 'disabled':true});
      }      
      console.log('productSubCategory', this.productSubCategory);
    })
  }

  navigateToProductDetails(selectedProduct:any){
    const url = 'home/productCategories/'+this.selectedMainCategory + '/' + this.selectedSubCategory + '/products/' + selectedProduct;
    console.log('url', url)
    this._router.navigateByUrl(url);
  }

}
