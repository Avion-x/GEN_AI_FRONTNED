import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './device-management/category-list/category-list.component';
import { CreateCategoryComponent } from './device-management/create-category/create-category.component';
import { DeviceListComponent } from './device-management/device-list/device-list.component';
import { DevicesComponent } from './devices/devices.component';
import { PagesComponent } from './pages.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductSubCategoryComponent } from './product-sub-category/product-sub-category.component';
import { ProductsComponent } from './products/products.component';
import { TestDeviceListComponent } from './test-execution/test-device-list/test-device-list.component';
import { TestCasesManagementComponent } from './testcases-management/test-cases-management/test-cases-management.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { UsersListComponent } from './user-management/users-list/users-list.component';

const routes: Routes = [
  { path: '', component: PagesComponent,
    children: [
      {
        path: '', redirectTo: 'productCategories', pathMatch: 'full'
      },
      {
        path: 'productCategories', component: DevicesComponent,
        //canActivate : [AuthGuard]
      },
      {
        path: 'productCategories/:mainID', component: DevicesComponent,
        //canActivate : [AuthGuard]
      },
      {
        path: 'productCategories/:mainID/:subID/products', component: ProductsComponent,
        //canActivate : [AuthGuard]
      },
      {
        path: 'productCategories/:mainID/:subID/products/:productID', component: ProductDetailsComponent,
        //canActivate : [AuthGuard]
      },
      {
        path: 'deviceManagement', component: CategoryListComponent,
        //canActivate : [AuthGuard]
      },
      {
        path: 'deviceManagement/createNewCategory', component: CreateCategoryComponent,
        //canActivate : [AuthGuard]
      },
      {
        path: 'deviceManagement/:subId/addNewDevices', component: DeviceListComponent,
        //canActivate : [AuthGuard]
      },
      {
        path: 'testCasesManagement', component: TestCasesManagementComponent,
        //canActivate : [AuthGuard]
      },
      {
        path: 'usersList', component: UsersListComponent,
        //canActivate : [AuthGuard]
      },
      {
        path: 'addUser', component: AddUserComponent,
        //canActivate : [AuthGuard]
      },
      {
        path:'testExecution', component: TestDeviceListComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
