import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryListComponent } from './device-management/category-list/category-list.component';
import { CreateCategoryComponent } from './device-management/create-category/create-category.component';
import { DeviceListComponent } from './device-management/device-list/device-list.component';
import { DevicesComponent } from './devices/devices.component';
import { AddNewEnterpriseComponent } from './enterprise/add-new-enterprise/add-new-enterprise.component';
import { EnterpriseManagementComponent } from './enterprise/enterprise-management/enterprise-management.component';
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
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
      },
      {
        path: 'dashboard', component: DashboardComponent,
        //canActivate : [AuthGuard]
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
        path: 'deviceManagement/:subId/deviceList', component: DeviceListComponent,
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
        path: 'usersList/:formState', component: AddUserComponent,
        //canActivate : [AuthGuard]
      },
      {
        path: 'usersList/:formState/:id', component: AddUserComponent,
        //canActivate : [AuthGuard]
      },
      {
        path:'testCaseManagement', component: TestDeviceListComponent,
      },
      {
        path:'testCaseManagement/:mainID/:subID/products/:productID', component: ProductDetailsComponent,
      },
      {
        path:'enterpriseManagement', component: EnterpriseManagementComponent,
      },
      {
        path:'enterpriseManagement/addNewEnterprise', component: AddNewEnterpriseComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
