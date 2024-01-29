import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { DevicesComponent } from './devices/devices.component';

import {TableModule} from 'primeng/table';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';
import {MenuModule} from 'primeng/menu';
import {SelectButtonModule} from 'primeng/selectbutton';



import { ProductsComponent } from './products/products.component';
import { ProductSubCategoryComponent } from './product-sub-category/product-sub-category.component';

import { ProductDetailsComponent } from './product-details/product-details.component';

import { MarkdownModule } from 'ngx-markdown';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { CategoryListComponent } from './device-management/category-list/category-list.component';
import { CreateCategoryComponent } from './device-management/create-category/create-category.component';
import { DeviceListComponent } from './device-management/device-list/device-list.component';
import { TestCasesManagementComponent } from './testcases-management/test-cases-management/test-cases-management.component';
import {SidebarModule} from 'primeng/sidebar';

@NgModule({
  declarations: [
    PagesComponent,
    DevicesComponent,
    ProductsComponent,
    ProductSubCategoryComponent,
    ProductDetailsComponent,
    CategoryListComponent,
    CreateCategoryComponent,
    DeviceListComponent,
    TestCasesManagementComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    TableModule,
    InputTextModule,
    CheckboxModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    SidebarModule,
    SelectButtonModule,
    MarkdownModule.forRoot()
  ]
})
export class PagesModule { }
